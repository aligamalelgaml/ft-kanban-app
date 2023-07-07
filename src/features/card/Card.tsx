import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentBoard } from '../board/boardsSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import { selectCards, fetchCards } from '../card/cardSlice';
import CircleIcon from '@mui/icons-material/Circle';

const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();

interface CardProps {
    listID: string;
    listName: string;
}

export default function CardTasks({ listID, listName }: CardProps) {
    const [color] = useState(() => getRandomColor());
    const currentBoard = useAppSelector(selectCurrentBoard);
    const cards = useAppSelector((state) => selectCards(state, listID));
    const dispatch = useAppDispatch();

    return (
        <>
            <Stack gap={1} direction={"row"} alignItems={"center"}>
                <CircleIcon sx={{ color: color, fontSize: "15px" }} />
                <Typography letterSpacing={2.4} textTransform={"uppercase"} noWrap fontWeight={700} color={"text.secondary"} fontSize={12}> {listName} ({cards.length}) </Typography>
            </Stack>

            {cards.map((card) =>
                <Card key={card.id} elevation={3} sx={{ padding: "20px" }}>
                    <Typography fontWeight={700} fontSize={15}> {card.name} </Typography>
                </Card>)}
        </>
    );
}
