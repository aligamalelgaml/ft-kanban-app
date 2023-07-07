import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addList, selectLists, fetchLists } from './listSlice';
import { selectCurrentBoard } from '../board/boardsSlice';
import { selectCards, fetchCards } from '../card/cardSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import CardTasks from '../card/Cards';

interface ListProps {
    list: { id: string, name: string, idBoard: string };
}

export default React.memo(({ list }: ListProps) => {
    
    return (
        <Stack gap={2}>
            <CardTasks listID={list.id} listName={list.name}/>
        </Stack>
    );
});

