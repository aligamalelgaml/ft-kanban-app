import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteCard, fetchCards } from './cardSlice';
import { selectLists } from '../list/listSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Dialog } from '@mui/material';

export default function CardMoreDropdown({ card, openEditDialog, onClose } : any) {
    const dispatch = useAppDispatch();
    const lists = useAppSelector(selectLists);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    /**
     * Opens the dropdown menu at menu location.
     * @param event Button click event
     */
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    /**
     * Closes the dropdown menu
     */
    const handleClose = () => {
        setAnchorEl(null);
    }

    /**
     * Closes the details modal and enables the edit dialog.
     */
    const handleOpenEditDialog = () => {
        openEditDialog();
        onClose();
    }

    const handleDeleteTask = () => {
        dispatch(deleteCard(card.id)).then((action) => {
            if(action.type === deleteCard.fulfilled.type) {
                dispatch(fetchCards(lists));
            }
        })
        onClose();
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    return (
        <>

            <Button
                id="basic-button"
                disableRipple
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ color: "text.secondary", "&:hover": {bgcolor: "transparent"} }}
            >
                <MoreVertIcon />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                PaperProps={{ // This allows us to access the styles of the dropdown itself.
                    sx: {
                        backgroundColor: 'background.more', 
                    },
                }}
            >
                <MenuItem sx={{ color: "text.secondary", fontSize: "13px", fontWeight: "500" }} onClick={handleOpenEditDialog}>Edit Task</MenuItem>
                <MenuItem sx={{ color: "destructive.main", fontSize: "13px", fontWeight: "500" }} onClick={() => setOpenDeleteDialog(true)}>Delete Task</MenuItem>
            </Menu>

            <Dialog
                fullWidth
                maxWidth={"xs"}
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle
                    sx={{
                        fontSize: "18px",
                        color: "primary.destructive",
                        fontWeight: "700",
                    }}
                >
                    Delete This Task?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: "text.secondary",
                            fontSize: "15px",
                            fontWeight: "500",
                        }}
                    >
                        Are you sure you want to delete the '{card.name}' task and its subtasks? This action cannot be reversed.
                    </DialogContentText>
                    <Stack sx={{ display: "flex", flexDirection: "row" }} mt={3} gap={2}>
                        <Button
                            onClick={handleDeleteTask}
                            sx={{
                                bgcolor: "destructive.main",
                                color: "#FFFFFF",
                                borderRadius: "50px",
                                flex: "1 1 50%",
                                textTransform: "none",
                                "&:hover": {
                                    bgcolor: "destructive.hover",
                                },
                            }}
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={handleCloseDeleteDialog}
                            sx={{
                                bgcolor: "secondary.main",
                                borderRadius: "50px",
                                flex: "1 1 50%",
                                textTransform: "none",
                                "&:hover": {
                                    bgcolor: "secondary.hover",
                                },
                            }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}