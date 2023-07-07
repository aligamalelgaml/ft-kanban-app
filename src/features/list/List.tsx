import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addList, selectLists, fetchLists } from './listSlice';
import { selectCurrentBoard } from '../board/boardsSlice';
import { selectCards, fetchCards } from '../card/cardSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

interface ListProps {
    list: { id: string, name: string, idBoard: string };
}

const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();

export default React.memo(({ list }: ListProps) => {
    const [color] = useState(() => getRandomColor());
    const currentBoard = useAppSelector(selectCurrentBoard);
    // const cards = useAppSelector((state) => selectCards(state, list.id));
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

            {/* {cards.map((card) =>
                <Card key={card.id} elevation={3} sx={{ padding: "20px" }}>
                    <Typography fontWeight={700} fontSize={15}> {card.name} </Typography>
                </Card>)} */}
        </Stack>
    );
});

