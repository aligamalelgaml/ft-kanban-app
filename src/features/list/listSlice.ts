import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
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
);

export const addList = createAsyncThunk(
    'list/addList',
    async ({ boardID, listName }: { boardID: string, listName: string }) => {
        const response = await axios.post(`https://api.trello.com/1/boards/${boardID}/lists?name=${listName}&key=${key}&token=${token}`);
        return response.data;
    }
);

export const listSlice = createSlice({
    name: 'list',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
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
            .addCase(addList.fulfilled, (state, action) => {
                state.status = 'idle';
                // console.log(action.payload);
            })
            .addCase(addList.rejected, (state) => {
                state.status = 'failed';
            })
    },
});

export const {  } = listSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectLists = (state: RootState) => state.list.lists;
export const selectListStatus = (state: RootState) => state.list.status;


export default listSlice.reducer;
