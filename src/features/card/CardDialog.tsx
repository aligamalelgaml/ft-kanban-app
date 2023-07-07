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
import { useForm, Controller } from 'react-hook-form';

interface FormDialogProps {
    open: boolean;
    data?: any;
    onClose: () => void;
}

export default function CardDialog({ open, data, onClose }: FormDialogProps) {
    const lists = useAppSelector(selectLists);

    const dispatch = useAppDispatch();
    const editing = data ? true : false;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm();


    const onSubmit = handleSubmit(async (newData) => {
        if (data) {
            // await dispatch(deleteTask(data.currentBoard.id));
        }

        dispatch(addCard({title: newData.title, desc: newData.desc, listID: newData.listID})).then((action) =>{
            if(action.type === addCard.fulfilled.type) {
                dispatch(fetchCards(lists));
            }
        } );

        reset();
        onClose();
    });

    /**
     * Adding exisiting data to textfields if provided to the dialog component.
     */
    // React.useEffect(() => {
    //     if (data) {
    //         setValue('boardName', data.currentBoard.name);
    //         data.lists.forEach((list: any, index: number) => {
    //             setValue(`additionalFields.${index}`, list.name);
    //         });
    //     }
    // }, [data]);


    return (
        <div>
            <Dialog fullWidth maxWidth={'xs'} open={open} onClose={onClose}>
                <form onSubmit={onSubmit}>
                    <DialogTitle fontWeight={700}>{editing ? "Edit" : "Add"} New Task</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Title
                        </DialogContentText>
                        <TextField
                            {...register('title', { required: true })}
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            error={!!errors.boardName}
                            helperText={errors.boardName ? 'Title is required!' : ''}
                        />

                        <DialogContentText mt={2}>
                            Description
                        </DialogContentText>
                        <TextField
                            {...register('desc')}
                            autoFocus
                            margin="dense"
                            id="desc"
                            type="text"
                            fullWidth
                            variant="outlined"
                            error={!!errors.desc}
                        />

                        <DialogContentText mt={2}>
                            Status
                        </DialogContentText>
                        <TextField
                            select
                            required
                            fullWidth
                            defaultValue=''
                            inputProps={register('listID')}
                        >
                            {lists.map((list) => (
                                <MenuItem key={uuidv4()} value={list.id}>
                                    {list.name}
                                </MenuItem>
                            ))}
                        </TextField>


                    </DialogContent>

                    <Stack gap={3} sx={{ padding: "30px" }}>
                        <Button type='submit' sx={{ textTransform: "none", fontSize: "13px", fontWeight: "700", borderRadius: "50px" }} variant='contained'> {data ? "Save Changes" : "Create New Task"}</Button>
                    </Stack>

                </form>
            </Dialog>
        </div>
    );
}