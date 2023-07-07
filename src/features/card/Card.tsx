import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentBoard } from '../board/boardsSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import { selectCards, fetchCards } from '../card/cardSlice';


interface CardProps {
    listID: string;
}

export default function CardTasks({ listID }: CardProps) {
    const currentBoard = useAppSelector(selectCurrentBoard);
    const cards = useAppSelector((state) => selectCards(state, listID));
    const dispatch = useAppDispatch();

    return (
        <>
            {cards.map((card) =>
                <Card key={card.id} elevation={3} sx={{ padding: "20px" }}>
                    <Typography fontWeight={700} fontSize={15}> {card.name} </Typography>
                </Card>)}
        </>
    );
}
