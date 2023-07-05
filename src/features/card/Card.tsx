import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentBoard } from '../board/boardsSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';

interface CardProps {
    card: { id: string, name: string, idBoard: string };
}

export default function CardTask({ card }: CardProps) {
    const currentBoard = useAppSelector(selectCurrentBoard);
    const dispatch = useAppDispatch();

    return (
        <Stack>
            {card.name}

            <Card>
                test
            </Card>

        </Stack>
    );
}
