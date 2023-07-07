import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addList, selectLists, fetchLists } from './listSlice';
import { selectCurrentBoard } from '../board/boardsSlice';
import { selectCards, fetchCards } from '../card/cardSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import CardTasks from '../card/Card';
import CircleIcon from '@mui/icons-material/Circle';

interface ListProps {
    list: { id: string, name: string, idBoard: string };
}

const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();

export default React.memo(({ list }: ListProps) => {
    const [color] = useState(() => getRandomColor());
    const currentBoard = useAppSelector(selectCurrentBoard);
    const dispatch = useAppDispatch();

    console.log("card list", list.name);

    // WIP: to prevent rerendering, move fetching of cards to parent (boards component) and pass each list's cards as a prop
    // useEffect(() => {
    //     dispatch(fetchCards(list.id));
    // }, [list])

    return (
        <Stack gap={2}>
            <Stack gap={1} direction={"row"} alignItems={"center"}>
                <CircleIcon sx={{ color: color, fontSize: "15px" }} />
                <Typography letterSpacing={2.4} textTransform={"uppercase"} fontWeight={700} color={"text.secondary"} fontSize={12}> {list.name} (cards.length) </Typography>
            </Stack>

            <CardTasks listID={list.id}/>
        </Stack>
    );
});

