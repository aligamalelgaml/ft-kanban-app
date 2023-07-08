import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentBoard } from '../board/boardsSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import { selectCards, fetchCards } from './cardSlice';
import CardDetails from './CardDetails';
import CircleIcon from '@mui/icons-material/Circle';
import { v4 as uuidv4 } from 'uuid';

const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();

interface CardProps {
    listID: string;
    listName: string;
}

export default function CardTasks({ listID, listName }: CardProps) {
    const [color] = useState(() => getRandomColor());
    const [openCardDetailsDialog, setOpenCardDetailsDialog] = useState("");
    const currentBoard = useAppSelector(selectCurrentBoard);
    const cards = useAppSelector((state) => selectCards(state, listID));
    const dispatch = useAppDispatch();

    const handleOpenCardDetails = (card: any) => {
        setOpenCardDetailsDialog(card);
    }

    const handleCloseCardDetails = () => {
        setOpenCardDetailsDialog("");
    }

    return (
        <>
            {!!openCardDetailsDialog && <CardDetails open={!!openCardDetailsDialog} onClose={handleCloseCardDetails} card={openCardDetailsDialog} />}

            <Stack gap={1} direction={"row"} alignItems={"center"}>
                <CircleIcon sx={{ color: color, fontSize: "15px" }} />
                <Typography letterSpacing={2.4} textTransform={"uppercase"} noWrap fontWeight={700} color={"text.secondary"} fontSize={12}> {listName} ({cards.length}) </Typography>
            </Stack>

            {cards.map((card) =>
                <Card onClick={() => handleOpenCardDetails(card)} key={card.id} elevation={3} sx={{ padding: "20px" }}>
                    <Typography fontWeight={700} fontSize={15}> {card.name} </Typography>
                </Card>)}

        </>
    );
}
