import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addList, selectLists, fetchLists } from './listSlice';
import { selectCurrentBoard } from '../board/boardsSlice';
import { Button, Box, Typography } from '@mui/material';


export default function List() {
    const lists = useAppSelector(selectLists);
    const currentBoard = useAppSelector(selectCurrentBoard);
    const dispatch = useAppDispatch();

    /**
     * Initial call to fetch all user boards.
     */
    useEffect(() => {
        if(currentBoard.id !== "") {
            dispatch(fetchLists(currentBoard.id));
        }
    }, [currentBoard])

    return (
        <>
            {console.log(lists)}

        </>
    );
}
