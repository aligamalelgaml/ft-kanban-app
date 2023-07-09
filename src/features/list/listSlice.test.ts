import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import listReducer from './listSlice'
import { fetchLists, selectLists } from './listSlice';
import {key, token} from '../../app/auth';


describe('List Slice', () => {
    let store: any;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                list: listReducer,
            },
        });

        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    test('fetchLists should update the state with fetched lists', async () => {
        const boardID = "64aa81eccf19fdfa701ae711";
        const mockLists = [
            { id: '64aa81ede197be8e82bddd35', name: 'Test List 1', idBoard: boardID },
            { id: '64aa81eda9f6738e889a5b12', name: 'Test List 2', idBoard: boardID },
            { id: '64aa81ed25b4f1480df05aa1', name: 'Test List 3', idBoard: boardID },
        ];

        mockAxios.onGet(`https://api.trello.com/1/boards/${boardID}/lists?key=${key}&token=${token}`).reply(200, mockLists);

        await store.dispatch(fetchLists(boardID)).unwrap();

        const state = store.getState();
        const fetchedLists = selectLists(state);

        expect(fetchedLists).toEqual(mockLists);
    });


});
