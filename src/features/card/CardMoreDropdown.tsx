import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteCard, fetchCards } from './cardSlice';
import { selectLists } from '../list/listSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export default function CardMoreDropdown({ card, openEditDialog, onClose } : any) {
    const dispatch = useAppDispatch();
    const lists = useAppSelector(selectLists);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

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

    return (
        <>

            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ color: "text.secondary" }}
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
                <MenuItem sx={{ color: "destructive.main", fontSize: "13px", fontWeight: "500" }} onClick={handleDeleteTask}>Delete Task</MenuItem>
            </Menu>
        </>
    );
}