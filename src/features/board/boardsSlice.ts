import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addList } from '../list/listSlice';
import { RootState } from '../../app/store';
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

/**
 * Fetches all boards assosicated with the member identified with the key & token provided.
 */
export const fetchBoards = createAsyncThunk(
  'board/fetchBoards',
  async () => {
    const response = await axios(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`);
    return response.data;
  }
)

/**
 * Creates a new board with optional accompanying lists.
 */
export const createBoard = createAsyncThunk(
  'board/createBoard',
  async ({ boardName, lists }: { boardName: string, lists: string[] }, { dispatch }) => {
      const encodedName = encodeURIComponent(boardName);

      await axios.post(`https://api.trello.com/1/boards/?name=${encodedName}&defaultLists=false&key=${key}&token=${token}`);

      const { data } = await axios(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`)

      const newBoard = data.find((board: any) => board.name === boardName); // Retreive new board data (id, to be more specific) as the API does not return the ID of the newly created board.

      if (lists.length !== 0) {
        await Promise.all(lists.map((listName) => dispatch(addList({ boardID: newBoard.id, listName })))); // This is made so so that newBoard only returns the new board when we are done pushing all the new columns to the new board first to prevent triggering an early refresh and having some missing columns that were otherwise still being POSTed to the trello API endpoint.
      }

      return newBoard;
  }
)

/**
 * Updates new board with new name.
 */
export const updateBoard = createAsyncThunk(
  'board/updateBoard',
  async ({boardID, boardName}: {boardID: string, boardName: string}) => {
    const encodedName = encodeURIComponent(boardName);

    await axios.put(`https://api.trello.com/1/boards/${boardID}?name=${encodedName}&key=${key}&token=${token}`);
  }
)

/**
 * Deletes board.
 */
export const deleteBoard = createAsyncThunk(
  'board/deleteBoard',
  async (boardID: string) => {
    await axios.delete(`https://api.trello.com/1/boards/${boardID}?key=${key}&token=${token}`);
  }
)

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setCurrentBoard: (state, action: PayloadAction<{ id: string, name: string }>) => {
      state.currentBoard = { id: action.payload.id, name: action.payload.name };
    }
  },
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
        throw new Error("Board fetching failed!")
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
        throw new Error("Board creation failed!")
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.status = 'idle';
        const deletedBoardId = action.meta.arg;
        state.boards = state.boards.filter(board => board.id !== deletedBoardId);
        state.currentBoard = { id: "", name: "" };
      })
      .addCase(deleteBoard.rejected, (state) => {
        state.status = 'failed';
        throw new Error("Board deletion failed!")
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.status = 'idle';
        const board = action.meta.arg;
        state.currentBoard = { id: board.boardID, name: board.boardName };
      })
      .addCase(updateBoard.rejected, (state) => {
        state.status = 'failed';
        throw new Error("Board update failed!")
      });
  },
});

export const { setCurrentBoard } = boardSlice.actions;

export const selectBoards = (state: RootState) => state.board.boards;
export const selectCurrentBoard = (state: RootState) => state.board.currentBoard;

export default boardSlice.reducer;
