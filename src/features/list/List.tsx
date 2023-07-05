import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addList, selectLists, fetchLists } from './listSlice';
import { selectCurrentBoard } from '../board/boardsSlice';
import { selectCards, fetchCards  } from '../card/cardSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';

interface ListProps {
    list: {id: string, name: string, idBoard: string};
  }

export default function List({ list }: ListProps) {
    const currentBoard = useAppSelector(selectCurrentBoard);
    const cards = useAppSelector((state) => selectCards(state, list.id));
    const dispatch = useAppDispatch();

    console.log("card list", list.name,  cards);

    useEffect(() => {
        dispatch(fetchCards(list.id));
    }, [list])



    return (
        <Stack>
        {list.name}
        <Card>
          
        </Card>

      </Stack>
    );
}
