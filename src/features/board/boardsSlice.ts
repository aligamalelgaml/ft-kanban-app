import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addList } from '../list/listSlice';
import { RootState, AppThunk } from '../../app/store';
import axios from 'axios';
import { key, token } from '../../app/auth';

export interface BoardState {
  boards: Array<{ id: string; name: string }>;
  currentBoard: { id: string, name: string };
  status: 'idle' | 'loading' | 'failed';
}

const initialState: BoardState = {
  boards: [],
  currentBoard: { id: "", name: "" },
  status: 'idle',
};

export const fetchBoards = createAsyncThunk(
  'board/fetchBoards',
  async () => {
    const response = await axios(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`);
    return response.data;
  }
)

export const createBoard = createAsyncThunk(
  'board/createBoard',
  async ({ boardName, lists }: { boardName: string, lists: string[] }, { dispatch }) => {
    try {
      const noLists = lists.length === 0;
      const postBoard = await axios.post(`https://api.trello.com/1/boards/?name=${boardName}&defaultLists=${noLists}&key=${key}&token=${token}`);
      const { data } = await axios(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`)
      const newBoard = data.find((board: any) => board.name === boardName);

      if (!noLists) {
        await Promise.all(lists.map((listName) => dispatch(addList({ boardID: newBoard.id, listName })))); // This is made so so that newBoard only returns the new board when we are done pushing all the new columns to the new board first to prevent triggering an early refresh and having some missing columns that were otherwise still being POSTed to the trello API endpoint.
      }

      return newBoard;
    } catch (error) {
      throw new Error('Board creation failed'); // Throw an error to trigger the rejection of the promise
    }
  }
)

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCurrentBoard: (state, action: PayloadAction<{ id: string, name: string }>) => {
      state.currentBoard = { id: action.payload.id, name: action.payload.name };
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = 'idle';
        state.boards = action.payload.map((board: any) => ({
          id: board.id,
          name: board.name,
        }));
      })
      .addCase(fetchBoards.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createBoard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentBoard = action.payload;
      })
      .addCase(createBoard.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setCurrentBoard } = boardSlice.actions;

export const selectBoards = (state: RootState) => state.board.boards;
export const selectCurrentBoard = (state: RootState) => state.board.currentBoard;

export default boardSlice.reducer;
