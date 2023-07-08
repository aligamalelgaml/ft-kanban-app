import { createAsyncThunk, createSlice, PayloadAction, createSelector, ParametricSelector } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import axios from 'axios';
import {key, token} from '../../app/auth';


interface Card {
  id: string;
  name: string;
  idBoard: string;
  idList: string;
  desc: string;
}

export interface CardState {
  cards: Record<string, Card[]>;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CardState = {
  cards: {},
  status: 'idle',
}

export const fetchCards = createAsyncThunk(
  'card/fetchCards',
  async (lists: Array<{ id: string }>) => {
    console.log("fetching:", lists)
    const responseArray = await Promise.all(
      lists.map(list =>
        axios(`https://api.trello.com/1/lists/${list.id}/cards?key=${key}&token=${token}`)
          .then(response => ({
            listID: list.id,
            cards: response.data
          }))
      )
    );

    const responseData = responseArray.reduce((data: any, { listID, cards }) => {
      data[listID] = cards;
      return data;
    }, {});

    return responseData;
  }
);

export const addCard = createAsyncThunk(
  'card/createCard',
  async (card: { title: string, desc?: string, listID: string }, { dispatch }) => {
    console.log("creating card:", card.title)

    // Encoding name and description to ensure they are URL-safe.
    const encodedTitle = encodeURIComponent(card.title);
    const encodedDesc = card.desc ? encodeURIComponent(card.desc) : '';
    
    const response = await axios.post(`https://api.trello.com/1/cards?idList=${card.listID}&name=${encodedTitle}&desc=${encodedDesc}&key=${key}&token=${token}`)

    return response.data;
  }
)

export const updateCard = createAsyncThunk(
  'card/updateCard',
  async (updatedCard: {id: string, title: string, desc: string, listID: string }) => {
    console.log("updating card:", updatedCard.title)

    // Encoding optional name and description to ensure they are URL-safe.
    const encodedTitle = encodeURIComponent(updatedCard.title);
    const encodedDesc = encodeURIComponent(updatedCard.desc);
    
    const response = await axios.put(`https://api.trello.com/1/cards/${updatedCard.id}?name=${encodedTitle}&desc=${encodedDesc}&idList=${updatedCard.listID}&key=${key}&token=${token}`);

    return response.data;
  }
);

export const deleteCard = createAsyncThunk(
  'card/deleteCard',
  async (cardID: string) => {
    console.log("deleting card:", cardID)

    const response = await axios.delete(`https://api.trello.com/1/cards/${cardID}?key=${key}&token=${token}`);

    return response.data;
  }
);

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    editCard: (state, action: PayloadAction<string>) => {
      console.log("editing card");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = 'idle';
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { editCard } = cardSlice.actions;

const selectCardState: ParametricSelector<RootState, unknown, CardState> = (state) => state.card;

export const selectAllCards = (state: RootState) => state.card.cards;

export const selectCards = createSelector(
  selectCardState,
  (_: RootState, listID: string) => listID,
  (cardState, listID) => {
    const cards = cardState.cards[listID];
    return cards || [];
  }
);

export default cardSlice.reducer;
