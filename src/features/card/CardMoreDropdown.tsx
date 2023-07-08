import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardDialog from './CardDialog';

export default function CardMoreDropdown({ card, onClose } : any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openEditCardDialog, setOpenEditCardDialog] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const closeEditDialog = () => {
        setOpenEditCardDialog(false);
    }

    React.useEffect(() => {
        if(openEditCardDialog) {
            onClose();
        }
    }, [openEditCardDialog])

    return (
        <>
            <CardDialog open={openEditCardDialog} onClose={closeEditDialog} data={card}/>

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
                <MenuItem sx={{ color: "text.secondary", fontSize: "13px", fontWeight: "500" }} onClick={() => setOpenEditCardDialog(true)}>Edit Task</MenuItem>
                <MenuItem sx={{ color: "destructive.main", fontSize: "13px", fontWeight: "500" }} onClick={handleClose}>Delete Task</MenuItem>
            </Menu>
        </>
    );
}