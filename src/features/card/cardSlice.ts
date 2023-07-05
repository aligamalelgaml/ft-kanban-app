import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import axios from 'axios';

type CardList = {
    idList: string;
    cards: Array<{ id: string; name: string; idBoard: string; idList: string }>;
}

export interface CardState {
    cards: Array<CardList>
    status: 'idle' | 'loading' | 'failed';
}

const initialState: CardState = {
    cards: [],
    status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const fetchCards = createAsyncThunk(
    'card/fetchCards',
    async (listID: string) => {
        console.log("Fetching List ID: ", listID);
        const response = await axios(`https://api.trello.com/1/lists/${listID}/cards?key=43fa6c84ae014f2d39ecd38e3813a8b0&token=ATTA831f4c44d08bddff424862f8de9220e91c2f7b7d53669bc6cf666fb8b9c8966a2AA36F4F`);
        return response.data;
    }
);


// export const editCard = createAsyncThunk(
//     'card/editCards',
//     async (listID: string) => {
//         const response = await axios(`https://api.trello.com/1/boards/${listID}/cards?key=43fa6c84ae014f2d39ecd38e3813a8b0&token=ATTA831f4c44d08bddff424862f8de9220e91c2f7b7d53669bc6cf666fb8b9c8966a2AA36F4F`);
//         return response.data;
//     }
// );

export const cardSlice = createSlice({
    name: 'card',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        editCard: (state, action: PayloadAction<string>) => {
            console.log("editing card")
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(fetchCards.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCards.fulfilled, (state, action) => {
                state.status = 'idle';
                action.payload.forEach((card: any) => {
                    const existingCardList = state.cards.find(
                        (cardList) => cardList.idList === card.idList
                    );

                    if (existingCardList) {
                        const existingCard = existingCardList.cards.find(
                            (c) => c.id === card.id
                        );

                        if (!existingCard) {
                            existingCardList.cards.push({
                                id: card.id,
                                name: card.name,
                                idBoard: card.idBoard,
                                idList: card.idList,
                            });
                        }
                    } else {
                        const newCardList = {
                            idList: card.idList,
                            cards: [
                                {
                                    id: card.id,
                                    name: card.name,
                                    idBoard: card.idBoard,
                                    idList: card.idList,
                                },
                            ],
                        };
                        state.cards.push(newCardList);
                    }
                });
            })
            .addCase(fetchCards.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { editCard } = cardSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCards = (state: RootState, listID: string) => state.card.cards.find((cardList) => cardList.idList === listID);

export default cardSlice.reducer;
