import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentBoard } from '../board/boardsSlice';
import { selectLists } from '../list/listSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import CardDialog from './CardDialog';

export default function AddCard() {
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const currentBoard = useAppSelector(selectCurrentBoard);
    const currentLists = useAppSelector(selectLists)

    const handleOpenTaskDialog = () => {
        setOpenTaskDialog(true);
    }

    return (
        <>
        <CardDialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)}/>

            <div style={{ display: "flex", alignItems: "center" }}>
                <Button onClick={handleOpenTaskDialog} variant='contained' sx={{ textTransform: "none", fontSize: "15px", fontWeight: "700", borderRadius: "50px", pointerEvents: currentLists.length === 0 ? "none" : "auto" }}>+ Add New Task</Button>
            </div>
        </>
    );
}
