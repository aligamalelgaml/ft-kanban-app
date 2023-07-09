import * as React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Box, Stack } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useForm } from 'react-hook-form';
import { createBoard, fetchBoards, updateBoard } from './boardsSlice';
import { updateList, addList, fetchLists } from '../list/listSlice'
import { selectCurrentBoard } from './boardsSlice';


interface FormData {
    boardName: string;
    additionalFields: { id: string; value: string }[]; // Modified additionalFields type
}

interface FormDialogProps {
    open: boolean;
    data?: any;
    onClose: () => void;
}

export default function FormDialog({ open, data, onClose }: FormDialogProps) {
    const dispatch = useAppDispatch();
    const currentBoard = useAppSelector(selectCurrentBoard);

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

    /**
     * Creates a new list with a value of a whitespace. It's important to note that we avoid using an empty string as that is equivelant to deleting a list.
     */
    const handleAddField = () => {
        setValue('additionalFields', [
            ...additionalFields,
            { id: '', value: ' ' },
        ]);
    };

    /**
     * Removes list found at index.
     * @param index | index of field being deleted.
     */
    const handleRemoveField = (index: number) => {
        setValue(`additionalFields.${index}.value`, "");
    };

    /**
     * Iterates over each 
     */
    const onSubmit = handleSubmit(({ boardName, additionalFields }) => {
        if (data) {
            console.log("Editing...", boardName, additionalFields);

            dispatch(updateBoard({boardID: currentBoard.id, boardName: boardName})).then((action) => {
                if(action.type === updateBoard.fulfilled.type) {
                    dispatch(fetchBoards())
                }
            })

            additionalFields.forEach((list) => {
                if (list.id === '') {
                    dispatch(addList({ boardID: currentBoard.id, listName: list.value })).then((action) => {
                        if (action.type === addList.fulfilled.type) {
                            dispatch(fetchLists(currentBoard.id));
                        }
                    })
                } else {
                    dispatch(updateList({ listID: list.id, listName: list.value, closed: list.value === "" })).then((action) => {
                        if (action.type === updateList.fulfilled.type) {
                            dispatch(fetchLists(currentBoard.id));
                        }
                    })
                }
            })

        } else {
            console.log("Adding...", boardName, additionalFields);

            const newBoardColumns = additionalFields?.map((field) => field.value) || [];
            dispatch(createBoard({ boardName, lists: newBoardColumns }));
        }

        reset();
        onClose();
    });

    React.useEffect(() => {
        if (data) {
            setValue('boardName', data.currentBoard.name);
            data.lists.forEach((list: any, index: number) => {
                setValue(`additionalFields.${index}.value`, list.name);
                setValue(`additionalFields.${index}.id`, list.id);
            });
        }
    }, [data]); // eslint-disable-line

    return (
        <div>
            <Dialog fullWidth maxWidth={'xs'} open={open} onClose={onClose}>
                <form onSubmit={onSubmit}>
                    <DialogTitle fontWeight={700}>
                        {editing ? 'Edit' : 'Add New'} Board
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>Name</DialogContentText>
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

                        {additionalFields.length !== 0 && (
                            <DialogContentText mt={2}>Columns</DialogContentText>
                        )}

                        <div>
                            {additionalFields.map((field, index) =>
                                field.value !== '' ? (
                                    <Box sx={{ display: 'flex' }} key={field.id}>
                                        <TextField
                                            {...register(`additionalFields.${index}.value`)}
                                            required
                                            autoFocus
                                            margin="dense"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                        />

                                        <IconButton
                                            onClick={() => handleRemoveField(index)}
                                            disableRipple
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </Box>
                                ) : null
                            )}
                        </div>
                    </DialogContent>

                    <Stack gap={3} sx={{ padding: '30px' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                                color: 'primary.main',
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: '700',
                                borderRadius: '50px',
                            }}
                            onClick={handleAddField}
                        >
                            + Add New Column
                        </Button>

                        <Button
                            type="submit"
                            sx={{
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: '700',
                                borderRadius: '50px',
                            }}
                            variant="contained"
                        >
                            {data ? 'Save Changes' : 'Create New Board'}
                        </Button>
                    </Stack>
                </form>
            </Dialog>
        </div>
    );
}
