import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addBoard, selectBoards, fetchBoards } from './boardsSlice';
import { Button, Box, Typography } from '@mui/material';
import List from '../list/List';

export function Boards() {
  const boards = useAppSelector(selectBoards);
  const dispatch = useAppDispatch();

  /**
   * Initial call to fetch all user boards.
   */
  useEffect(() => {
    dispatch(fetchBoards());
  }, [])

  return (
    <>
      {console.log(boards)}

        {boards &&
          <Typography align='center' marginY={"35vh"}>
            No boards created, create a board first.
          </Typography>
        }


        <List/>
    </>
  );
}
