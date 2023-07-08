import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchLists, selectLists } from '../list/listSlice';
import { deleteBoard, fetchBoards, selectCurrentBoard, setCurrentBoard } from '../board/boardsSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { IconButton } from '@mui/material';
import BoardDialog from './BoardDialog'
import { v4 as uuidv4 } from 'uuid';


export default function BoardMoreDropdown() {
    const dispatch = useAppDispatch();
    const currentBoard = useAppSelector(selectCurrentBoard);
    const lists = useAppSelector(selectLists);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openBoardEditDialog, setOpenBoardEditDialog]= React.useState(false);

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

    const handleDeleteBoard = () => {
        dispatch(deleteBoard(currentBoard.id)).then((action) => {
            if (action.type === deleteBoard.fulfilled.type) {
                dispatch(fetchBoards());
            }
        });
        handleClose();
    };

    const handleBoardDialogeClose = () => {
        setOpenBoardEditDialog(false);
    }

    return (
        <>
            <BoardDialog key={uuidv4()} open={openBoardEditDialog} data={{ currentBoard, lists }} onClose={handleBoardDialogeClose} />

            <IconButton id="boardDropdownIcon"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ color: "text.secondary", marginLeft: "4px" }}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'boardDropdownIcon',
                }}
                PaperProps={{ // This allows us to access the styles of the dropdown itself.
                    sx: {
                        backgroundColor: 'background.more',
                    },
                }}
            >
                <MenuItem sx={{ color: "text.secondary", fontSize: "13px", fontWeight: "500" }} onClick={() => setOpenBoardEditDialog(true)} >Edit Board</MenuItem>
                <MenuItem sx={{ color: "destructive.main", fontSize: "13px", fontWeight: "500" }} onClick={handleDeleteBoard}>Delete Board</MenuItem>
            </Menu>
        </>
    );
}