import * as React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Box, Stack } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { v4 as uuidv4 } from 'uuid';
import { useForm, FieldErrors } from 'react-hook-form';
import { createBoard, deleteBoard } from './boardsSlice';

interface FormData {
    boardName: string;
    additionalFields: string[];
}

/**
 * Creating an interface for the expected props of the add/edit dialog for boards. Data is an optional prop that determines whether we are editing or creating.
 */
interface FormDialogProps {
    open: boolean;
    data?: any;
    onClose: () => void;
}

export default function FormDialog({ open, data, onClose }: FormDialogProps) {
    const dispatch = useAppDispatch();
    const editing = data ? true : false;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FormData>();

    const additionalFields = watch('additionalFields') || [];

    const handleAddField = () => {
        setValue('additionalFields', [...additionalFields, '']);
    }

    const handleRemoveField = (index: number) => {
        setValue(
            'additionalFields',
            additionalFields.filter((_, i) => i !== index)
        );
    };

    const onSubmit = handleSubmit(async ({ boardName, additionalFields }) => {
        if (data) {
            await dispatch(deleteBoard(data.currentBoard.id));
        }

        console.log("adding", boardName, additionalFields )

        dispatch(createBoard({ boardName, lists: additionalFields || [] }));

        reset();
        onClose();
    });

    /**
     * Adding exisiting data to textfields if provided to the dialog component.
     */
    React.useEffect(() => {
        if (data) {
            setValue('boardName', data.currentBoard.name);
            data.lists.forEach((list: any, index: number) => {
                setValue(`additionalFields.${index}`, list.name);
            });
        }
    }, [data]);


    return (
        <div>
            <Dialog fullWidth maxWidth={'xs'} open={open} onClose={onClose}>
                <form onSubmit={onSubmit}>
                    <DialogTitle fontWeight={700}>{editing ? "Edit" : "Add"} New Board</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Name
                        </DialogContentText>
                        <TextField
                            {...register('boardName', { required: true })}
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            error={!!errors.boardName}
                            helperText={errors.boardName ? 'Board name is required!' : ''}
                        />

                        {additionalFields.length != 0 &&
                            <DialogContentText mt={2}>
                                Columns
                            </DialogContentText>
                        }

                        <div>
                            {additionalFields.map((_, index) =>
                                <Box sx={{ display: "flex" }} key={index}>
                                    <TextField
                                        {...register(`additionalFields.${index}`)}
                                        required
                                        autoFocus
                                        margin="dense"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                    />

                                    <IconButton onClick={() => handleRemoveField(index)} disableRipple>
                                        <ClearIcon />
                                    </IconButton>

                                </Box>
                            )}
                        </div>
                    </DialogContent>

                    <Stack gap={3} sx={{ padding: "30px" }}>
                        <Button variant='contained' color='secondary' sx={{ color: "primary.main", textTransform: "none", fontSize: "13px", fontWeight: "700", borderRadius: "50px" }} onClick={handleAddField}>+ Add New Column</Button>

                        <Button type='submit' sx={{ textTransform: "none", fontSize: "13px", fontWeight: "700", borderRadius: "50px" }} variant='contained'>Create New Board</Button>
                    </Stack>
                </form>
            </Dialog>
        </div>
    );
}