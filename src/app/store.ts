import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import boardReducer from '../features/board/boardsSlice';
import listReducer from '../features/list/listSlice';
import cardReducer from '../features/card/cardSlice';

export const store = configureStore({
  reducer: {
    board: boardReducer,
    list: listReducer,
    card: cardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
