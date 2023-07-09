import React, { useState, useContext } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Menu, MenuItem, IconButton, useTheme } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Box, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Typography, Switch } from '@mui/material';
import { setCurrentBoard, selectBoards, selectCurrentBoard } from './boardsSlice';
import BoardDialog from './BoardDialog';
import { ColorModeContext } from '../../App';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';


export default function MobileDropdownMenu() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const boards = useAppSelector(selectBoards);
    const [boardDialogeOpen, setBoardDialogeOpen] = useState(false) // Create board dialoge state.
    const currentBoard = useAppSelector(selectCurrentBoard);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMobileMenu = Boolean(anchorEl);
    const colorMode = useContext(ColorModeContext);

    const handleAddBoard = () => {
        setBoardDialogeOpen(true);
    }

    const handleBoardDialogeClose = () => {
        setBoardDialogeOpen(false);
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (board: any) => {
        dispatch(setCurrentBoard(board))
        handleClose();
    }


    return (
        <div>
            <IconButton onClick={handleClick}>
                {openMobileMenu ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={openMobileMenu}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >

                <BoardDialog open={boardDialogeOpen} onClose={handleBoardDialogeClose} />



                <Box sx={{ padding: "20px" }}>
                    <Typography textTransform={'uppercase'} fontSize={12} letterSpacing={2.4} lineHeight={1} fontWeight={700} color={"text.secondary"}>
                        All Boards ({boards.length})
                    </Typography>
                </Box>

                <List>
                    {boards.map((board: any) =>
                        <ListItem sx={{ width: "95%" }} key={board.id} disablePadding>
                            <ListItemButton onClick={() => handleSelect(board)} selected={board.id === currentBoard.id}
                                sx={{
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    whiteSpace: "nowrap",
                                    width: "85%",
                                    borderRadius: "0px 20px 20px 0px",
                                    pointerEvents: board.id === currentBoard.id ? "none" : "auto",
                                    '&:hover': { // colors on hover
                                        backgroundColor: 'secondary.main',
                                        '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                    },
                                    '&.Mui-selected': { // colors when selected
                                        backgroundColor: 'primary.main',
                                        '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                                            color: '#FFFFFF',
                                        }, '&:hover': { // colors on hover & selected
                                            backgroundColor: 'secondary.main',
                                            '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                                                color: 'primary.main',
                                            },
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon style={{ minWidth: '35px' }}>
                                    <TableChartIcon />
                                </ListItemIcon>
                                <ListItemText primary={board.name} />
                            </ListItemButton>
                        </ListItem>
                    )}

                    <ListItem sx={{ width: "85%" }} disablePadding>
                        <ListItemButton onClick={() => handleAddBoard()}
                            sx={{
                                fontSize: "15px",
                                fontWeight: "700",
                                whiteSpace: "nowrap",
                                color: "primary.main",
                                width: "85%",
                                borderRadius: "0px 20px 20px 0px",
                                '& .MuiListItemIcon-root': {
                                    color: "primary.main"
                                },
                                '&:hover': { // colors on hover
                                    backgroundColor: 'secondary.main',
                                    '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    },
                                },
                                '&.Mui-selected': { // colors when selected
                                    backgroundColor: 'primary.main',
                                    '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                                        color: '#FFFFFF',
                                    }, '&:hover': { // colors on hover & selected
                                        backgroundColor: 'secondary.main',
                                        '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                    },
                                },
                            }}
                        >
                            <ListItemIcon style={{ minWidth: '35px' }}>
                                <TableChartIcon />
                            </ListItemIcon>
                            <ListItemText primary={"+ Create New Board"} />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Box
                    sx={{
                        display: 'flex',
                        width: '80%',
                        marginX: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 1,
                        p: "10 20 10 20",
                    }}
                >
                    <LightModeIcon />
                    <Switch checked={theme.palette.mode === 'dark'} onChange={colorMode.toggleColorMode} sx={{ marginLeft: '8px', marginRight: '8px' }} />
                    <DarkModeIcon />
                </Box>
            </Menu>
        </div>
    );
}

