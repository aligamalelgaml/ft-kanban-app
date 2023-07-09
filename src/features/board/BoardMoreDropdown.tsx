import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { fetchLists, selectLists } from "../list/listSlice";
import {
    deleteBoard,
    fetchBoards,
    selectCurrentBoard,
    setCurrentBoard,
} from "../board/boardsSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { IconButton, Stack } from "@mui/material";
import BoardDialog from "./BoardDialog";
import { v4 as uuidv4 } from "uuid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function BoardMoreDropdown() {
    const dispatch = useAppDispatch();
    const currentBoard = useAppSelector(selectCurrentBoard);
    const lists = useAppSelector(selectLists);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openBoardEditDialog, setOpenBoardEditDialog] = React.useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    /**
     * Opens the dropdown menu at menu location.
     * @param event Button click event
     */
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Closes the dropdown menu
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    /**
     * Calls the dispatch to delete the board and then refetches boards to update UI, also closes the current menu and delete confirmation dialog.
     */
    const handleDeleteBoard = () => {
        dispatch(deleteBoard(currentBoard.id)).then((action) => {
            if (action.type === deleteBoard.fulfilled.type) {
                dispatch(fetchBoards());
            }
        });
        handleClose();
        handleCloseDeleteDialog();
    };

    /**
     * Opens the board edit dialog.
     */
    const handleBoardDialogeClose = () => {
        setOpenBoardEditDialog(false);
    };

    /**
     * Closes the board edit dialog.
     */
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <>
            <BoardDialog
                key={uuidv4()}
                open={openBoardEditDialog}
                data={{ currentBoard, lists }}
                onClose={handleBoardDialogeClose}
            />

            <IconButton
                id="boardDropdownIcon"
                disableRipple
                disableFocusRipple
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
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
                    "aria-labelledby": "boardDropdownIcon",
                }}
                PaperProps={{
                    // This allows us to access the styles of the dropdown itself.
                    sx: {
                        backgroundColor: "background.more",
                    },
                }}
            >
                <MenuItem
                    sx={{ color: "text.secondary", fontSize: "13px", fontWeight: "600" }}
                    disabled={currentBoard.id === ""}
                    onClick={() => setOpenBoardEditDialog(true)}
                >
                    Edit Board
                </MenuItem>
                <MenuItem
                    sx={{
                        color: "destructive.main",
                        fontSize: "13px",
                        fontWeight: "600",
                    }}
                    disabled={currentBoard.id === ""}
                    onClick={() => setOpenDeleteDialog(true)}
                >
                    Delete Board
                </MenuItem>
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
                    Delete This Board?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: "text.secondary",
                            fontSize: "15px",
                            fontWeight: "500",
                        }}
                    >
                        Are you sure you want to delete the '{currentBoard.name}' board?
                        This action will remove all columns and tasks and cannot be
                        reversed.
                    </DialogContentText>
                    <Stack sx={{ display: "flex", flexDirection: "row" }} mt={3} gap={2}>
                        <Button
                            onClick={handleDeleteBoard}
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
