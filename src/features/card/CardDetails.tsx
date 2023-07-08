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
import { addCard, updateCard, fetchCards } from '../card/cardSlice';
import { IconButton, Box, Stack, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';


interface FormDialogProps {
    open: boolean;
    card: any;
    onClose: () => void;
}

export default function CardDetails({ open, card, onClose }: FormDialogProps) {
    const lists = useAppSelector(selectLists);
    const dispatch = useAppDispatch();

    console.log(card);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm();

    const handleChangeList = (event: React.ChangeEvent<{ value: string }>) => {
        const selectedListID = event.target.value;
        setValue('listID', selectedListID);

        dispatch(updateCard({id: card.id, title: card.name, desc: card.desc, listID: selectedListID})).then((action) => {
            if(action.type === updateCard.fulfilled.type) {
                dispatch(fetchCards(lists))
            }
        });
    };

    return (
        <div>
            <Dialog fullWidth maxWidth={'xs'} open={open} onClose={onClose}>
                <DialogContent>
                    <DialogTitle sx={{ fontSize: "18px", fontWeight: "700" }}>{card.name}</DialogTitle>
                    <DialogContentText color={"text.secondary"}>
                        {card.desc}
                    </DialogContentText>
                    <DialogContentText color={"text.primary"} mt={3} mb={1} fontWeight={700}>
                        Current Status
                    </DialogContentText>

                    <TextField
                        select
                        required
                        fullWidth
                        onChange={handleChangeList}
                        defaultValue={card.idList}
                        inputProps={register('listID')}
                    >
                        {lists.map((list) => (
                            <MenuItem key={uuidv4()} value={list.id}>
                                {list.name}
                            </MenuItem>
                        ))}
                    </TextField>

                </DialogContent>

            </Dialog>
        </div>
    );
}