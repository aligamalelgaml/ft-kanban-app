import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectBoards, fetchBoards, selectCurrentBoard } from './boardsSlice';
import { selectLists, fetchLists } from '../list/listSlice';
import { Button, Box, Typography, Stack, Grid, Card } from '@mui/material';
import List from '../list/List';

export function Boards() {
  const boards = useAppSelector(selectBoards);
  const lists = useAppSelector(selectLists);
  const currentBoard = useAppSelector(selectCurrentBoard);
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
      {console.log(lists)}

      {!boards &&
        <Typography align='center' marginY={"35vh"}>
          No boards created, create a board first.
        </Typography>
      }

      <Grid container spacing={2}>
        {lists.map((list) =>
          <Grid key={list.id} item xs={12} md={4}>
              <List list={list}/>
          </Grid>
        )}

      </Grid>
    </>
  );
}
