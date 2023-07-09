// import * as React from 'react';
// import { useAppSelector, useAppDispatch } from '../../app/hooks';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import { IconButton, Box, Stack } from '@mui/material';
// import ClearIcon from '@mui/icons-material/Clear';
// import { v4 as uuidv4 } from 'uuid';
// import { useForm, FieldErrors } from 'react-hook-form';
// import { createBoard, deleteBoard } from './boardsSlice';

// interface FormData {
//     boardName: string;
//     additionalFields: string[];
// }

// /**
//  * Creating an interface for the expected props of the add/edit dialog for boards. Data is an optional prop that determines whether we are editing or creating.
//  */
// interface FormDialogProps {
//     open: boolean;
//     data?: any;
//     onClose: () => void;
// }

// export default function FormDialog({ open, data, onClose }: FormDialogProps) {
//     const dispatch = useAppDispatch();
//     const editing = data ? true : false;


//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         formState: { errors },
//         reset,
//     } = useForm<FormData>();

//     const additionalFields = watch('additionalFields') || [];

//     const handleAddField = () => {
//         setValue('additionalFields', [...additionalFields, '']);
//     }

//     const handleRemoveField = (index: number) => {
//         setValue(
//             'additionalFields',
//             additionalFields.filter((_, i) => i !== index)
//         );
//     };

//     const onSubmit = handleSubmit(({ boardName, additionalFields }) => {
//         // WIP: refactoring list/board edition to utilize PUT instead of destroying then creating boards which causes loss of cards (tasks) on list renaming.
//         if (data) {

//         }

//         console.log("adding", boardName, additionalFields)

//         // dispatch(createBoard({ boardName, lists: additionalFields || [] }));

//         reset();
//         onClose();
//     });

//     /**
//      * Adding exisiting data to textfields if provided to the dialog component.
//      */
//     React.useEffect(() => {
//         if (data) {
//             setValue('boardName', data.currentBoard.name);
//             data.lists.forEach((list: any, index: number) => {
//                 setValue(`additionalFields.${index}`, list.name);
//             });
//         }
//     }, [data]);


//     return (
//         <div>
//             <Dialog fullWidth maxWidth={'xs'} open={open} onClose={onClose}>
//                 <form onSubmit={onSubmit}>
//                     <DialogTitle fontWeight={700}>{editing ? "Edit" : "Add New"} Board</DialogTitle>
//                     <DialogContent>
//                         <DialogContentText>
//                             Name
//                         </DialogContentText>
//                         <TextField
//                             {...register('boardName', { required: true })}
//                             autoFocus
//                             required
//                             margin="dense"
//                             id="name"
//                             type="text"
//                             fullWidth
//                             variant="outlined"
//                             error={!!errors.boardName}
//                             helperText={errors.boardName ? 'Board name is required!' : ''}
//                         />

//                         {additionalFields.length != 0 &&
//                             <DialogContentText mt={2}>
//                                 Columns
//                             </DialogContentText>
//                         }

//                         <div>
//                             {additionalFields.map((_, index) =>
//                                 <Box sx={{ display: "flex" }} key={index}>
//                                     <TextField
//                                         {...register(`additionalFields.${index}`)}
//                                         required
//                                         autoFocus
//                                         margin="dense"
//                                         type="text"
//                                         fullWidth
//                                         variant="outlined"
//                                     />

//                                     <IconButton onClick={() => handleRemoveField(index)} disableRipple>
//                                         <ClearIcon />
//                                     </IconButton>

//                                 </Box>
//                             )}
//                         </div>
//                     </DialogContent>

//                     <Stack gap={3} sx={{ padding: "30px" }}>
//                         <Button variant='contained' color='secondary' sx={{ color: "primary.main", textTransform: "none", fontSize: "13px", fontWeight: "700", borderRadius: "50px" }} onClick={handleAddField}>+ Add New Column</Button>

//                         <Button type='submit' sx={{ textTransform: "none", fontSize: "13px", fontWeight: "700", borderRadius: "50px" }} variant='contained'> {data ? "Save Changes" : "Create New Board"}</Button>
//                     </Stack>
//                 </form>
//             </Dialog>
//         </div>
//     );
// }

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
import { v4 as uuidv4 } from 'uuid';
import { useForm, FieldErrors, Control } from 'react-hook-form';
import { createBoard, deleteBoard } from './boardsSlice';
import { updateList, addList, selectLists, fetchLists } from '../list/listSlice'
import { selectBoards, fetchBoards, selectCurrentBoard } from './boardsSlice';
import { fetchCards } from '../card/cardSlice';


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
    const lists = useAppSelector(selectLists);
    const editing = data ? true : false;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
        reset,
    } = useForm<FormData>();

    const additionalFields = watch('additionalFields') || [];

    const handleAddField = () => {
        setValue('additionalFields', [
            ...additionalFields,
            { id: '', value: '' },
        ]);
    };

    const handleRemoveField = (index: number) => {
        setValue(`additionalFields.${index}.value`, "deleted");
    };

    const onSubmit = handleSubmit(({ boardName, additionalFields }) => {
        if (data) {
            console.log("editing", boardName, additionalFields);

            additionalFields.forEach((list) => {
                if (list.id === '') {
                    dispatch(addList({ boardID: currentBoard.id, listName: list.value })).then((action) => {
                        if (action.type === addList.fulfilled.type) {
                            dispatch(fetchLists(currentBoard.id));
                        }
                    })
                } else {
                    dispatch(updateList({ listID: list.id, listName: list.value, closed: list.value === "deleted" })).then((action) => {
                        if (action.type === updateList.fulfilled.type) {
                            dispatch(fetchLists(currentBoard.id));
                        }
                    })
                }
            })

        } else {
            console.log("adding", boardName, additionalFields);
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
    }, [data]);

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
                                field.value !== 'deleted' ? (
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
