import { createAsyncThunk, createSlice, PayloadAction, createSelector, ParametricSelector } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import axios from 'axios';

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
};

export const fetchCards = createAsyncThunk(
  'card/fetchCards',
  async (listID: string) => {
    console.log("Fetching List ID: ", listID);
    const response = await axios(`https://api.trello.com/1/lists/${listID}/cards?key=43fa6c84ae014f2d39ecd38e3813a8b0&token=ATTA831f4c44d08bddff424862f8de9220e91c2f7b7d53669bc6cf666fb8b9c8966a2AA36F4F`);
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
        action.payload.forEach((card: Card) => {
          const { idList, id } = card;

          if (!state.cards[idList]) {
            state.cards[idList] = [];
          }

          const existingCard = state.cards[idList].find((c) => c.id === id);
          if (!existingCard) {
            state.cards[idList].push({id: card.id, name: card.name, idBoard: card.idBoard, idList: card.idList});
          }
        });
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
    const typedCardState = cardState as CardState;
    const cardList = typedCardState.cards[listID];
    return cardList || [];
  }
);

export default cardSlice.reducer;
