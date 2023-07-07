import * as React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { selectLists } from '../list/listSlice';
import { addCard, fetchCards } from '../card/cardSlice';
import { IconButton, Box, Stack, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { v4 as uuidv4 } from 'uuid';

interface FormDialogProps {
    open: boolean;
    card: any;
    onClose: () => void;
}

export default function CardDetails({ open, card, onClose }: FormDialogProps) {
    const lists = useAppSelector(selectLists);
    const dispatch = useAppDispatch();

    console.log(card);


    return (
        <div>
            <Dialog fullWidth maxWidth={'xs'} open={open} onClose={onClose}>
                <DialogTitle sx={{fontSize: "18px", fontWeight: "700"}}>{card.name}</DialogTitle>
                <DialogContentText color={"text.secondary"} padding={3}>
                    {card.desc}
                </DialogContentText>
                <DialogContentText color={"text.secondary"} fontWeight={700} padding={3}>
                    Current Status
                    {/* // WIP: Add status textfield here to change from list to list. */}
                </DialogContentText>


            </Dialog>
        </div>
    );
}