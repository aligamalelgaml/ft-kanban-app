import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectBoards, fetchBoards, selectCurrentBoard } from './boardsSlice';
import { selectLists, fetchLists, selectListStatus } from '../list/listSlice';
import { selectCards, fetchCards } from '../card/cardSlice';
import { Button, Box, Typography, Stack, Grid, Card, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import List from '../list/List';
import BoardDialog from './BoardDialog';
import { v4 as uuidv4 } from 'uuid';

export function Boards() {
  const [openEditBoardDialog, setOpenEditBoardDialog] = useState(false);

  const boards = useAppSelector(selectBoards);
  const currentBoard = useAppSelector(selectCurrentBoard);
  const lists = useAppSelector(selectLists);
  const listStatus = useAppSelector(selectListStatus);
  const loadingLists = useAppSelector(selectListStatus) === "loading";
  const dispatch = useAppDispatch();


  /**
   * Initial call to fetch all user boards + switches to new board upon new board creation, also fetchs user lists (columns) once currentBoard changes then fetches cards.
   */
  useEffect(() => {
    dispatch(fetchBoards());

    if (currentBoard.id !== "") {
      dispatch(fetchLists(currentBoard.id)).then((action) => {
        if (action.type === fetchLists.fulfilled.type) {
          const fetchedLists = action.payload;
          dispatch(fetchCards(fetchedLists));
        }
      });
    }
  }, [currentBoard]);

  const handleEditBoardDialog = () => {
    setOpenEditBoardDialog(true);
  }

  const handleCloseEditBoardDialog = () => {
    setOpenEditBoardDialog(false);
  }

  return (
    <>
      <BoardDialog key={uuidv4()} open={openEditBoardDialog} data={{ currentBoard, lists }} onClose={handleCloseEditBoardDialog} />
      
      {loadingLists === true ?
        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: "30vh" }}>
          <CircularProgress />
        </Box>
        :
        <>
          {lists.length === 0 &&
            <Stack gap={2} sx={{ display: "flex", flexDirection: "column", justifyItems: "center", alignItems: "center" }} marginY={"35vh"}>
              <Typography align='center' >
                This board is empty. Create a new column to get started.
              </Typography>

              <Button onClick={handleEditBoardDialog} sx={{ width: "10vw", borderRadius: "50px", textTransform: "none", fontSize: "15px", fontWeight: "700" }} variant='contained'>
                + Add New Column
              </Button>

            </Stack>
          }

          {!boards &&
            <Typography align='center' marginY={"35vh"}>
              No boards created, create a board first.
            </Typography>
          }

          {!loadingLists &&
            <Stack gap={10} direction={"row"}>
              {lists.map((list) => {
                return list.idBoard === currentBoard.id &&
                  <Grid key={list.id} item xs={12} md={4}>
                    <List list={list} />
                  </Grid>
              }
              )}

              <Grid item>
                <Paper sx={{ color: "text.secondary", fontWeight: "700", bgcolor: '#E4EBFA', height: "100%", padding: "35px", display: 'flex', justifyContent: 'center', alignItems: 'center', }} onClick={handleEditBoardDialog}>
                  + New Column
                </Paper>
              </Grid>
            </Stack>
          }

        </>
      }



    </>
  );
}
