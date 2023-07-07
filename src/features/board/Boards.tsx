import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectBoards, fetchBoards, selectCurrentBoard } from './boardsSlice';
import { selectLists, fetchLists, selectListStatus } from '../list/listSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import List from '../list/List';

export function Boards() {
  const boards = useAppSelector(selectBoards);
  const currentBoard = useAppSelector(selectCurrentBoard);
  const lists = useAppSelector(selectLists);
  const loadingLists = useAppSelector(selectListStatus) === "loading";
  const dispatch = useAppDispatch();

  /**
   * Initial call to fetch all user boards + switches to new board upon new board creation, also fetchs user lists (columns) once currentBoard changes.
   */
  useEffect(() => {
    dispatch(fetchBoards());
    if (currentBoard.id !== "") {
      dispatch(fetchLists(currentBoard.id));
    }
  }, [currentBoard])

  return (
    <>
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

              <Button sx={{ width: "10vw", borderRadius: "50px", textTransform: "none", fontSize: "15px", fontWeight: "700" }} variant='contained'>
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
            <Grid container spacing={2}>
              {lists.map((list) =>
                <Grid key={list.id} item xs={12} md={4}>
                  <List list={list} />
                </Grid>
              )}
            </Grid>
          }
        </>
      }



    </>
  );
}
