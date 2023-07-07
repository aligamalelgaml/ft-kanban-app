import { createAsyncThunk, createSlice, PayloadAction, createSelector, ParametricSelector } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import axios from 'axios';
import {key, token} from '../../app/auth';


interface Card {
  id: string;
  name: string;
  idBoard: string;
  idList: string;
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
        // action.payload.forEach((card: Card) => {
        //   const { idList, id } = card;

        //   if (!state.cards[idList]) {
        //     state.cards[idList] = [];
        //   }

        //   const existingCard = state.cards[idList].find((c) => c.id === id);
        //   if (!existingCard) {
        //     state.cards[idList].push({id: card.id, name: card.name, idBoard: card.idBoard, idList: card.idList});
        //   }
        // });
      })
      .addCase(fetchCards.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { editCard } = cardSlice.actions;

const selectCardState: ParametricSelector<RootState, unknown, CardState> = (state) => state.card;

export const selectCards = createSelector(
  selectCardState,
  (_: RootState, listID: string) => listID,
  (cardState, listID) => {
    const cards = cardState.cards[listID];
    return cards || [];
  }
);

export default cardSlice.reducer;
