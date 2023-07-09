import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import {key, token} from '../../app/auth';


export interface ListState {
    lists: Array<{ id: string; name: string, idBoard: string }>;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: ListState = {
    lists: [],
    status: 'idle',
};

/**
 * Fetches all lists belonging to the passed board ID arguement 
 */
export const fetchLists = createAsyncThunk(
    'list/fetchLists',
    async (boardID: string) => {
        if(boardID !== "") {
            const response = await axios(`https://api.trello.com/1/boards/${boardID}/lists?key=${key}&token=${token}`);
            return response.data;
        } else {
            return [];
        }
    }
)

/**
 * Creates a new list using pased board ID and list name args.
 */
export const addList = createAsyncThunk(
    'list/addList',
    async ({ boardID, listName }: { boardID: string, listName: string }) => {
        const encodedName = encodeURIComponent(listName);

        const response = await axios.post(`https://api.trello.com/1/boards/${boardID}/lists?name=${encodedName}&key=${key}&token=${token}`);
        return response.data;
    }
)

/**
 * Updates list, if list name is equal to an empty string, then that means the list was deleted and the assosciated list ID should be set as closed, if not, update with the new passed args.
 */
export const updateList = createAsyncThunk(
    'list/updateList',
    async ({ listID, listName, closed }: { listID: string, listName: string, closed: boolean }) => {
        const response = listName === "!SIG_DELETE" ? await axios.put(`https://api.trello.com/1/lists/${listID}?closed=${closed}&key=${key}&token=${token}`) : await axios.put(`https://api.trello.com/1/lists/${listID}?name=${listName}&closed=${closed}&key=${key}&token=${token}`);
        return response.data;
    }
)

export const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLists.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLists.fulfilled, (state, action) => {
                state.status = 'idle';
                state.lists = action.payload.map((list: any) => ({
                    id: list.id,
                    name: list.name,
                    idBoard: list.idBoard,
                }));
            })
            .addCase(fetchLists.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addList.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(addList.rejected, (state) => {
                state.status = 'failed';
            })
    },
});

// export const {  } = listSlice.actions; --> Unneeded, but commented out in case it's needed in the future.

export const selectLists = (state: RootState) => state.list.lists;
export const selectListStatus = (state: RootState) => state.list.status;


export default listSlice.reducer;
