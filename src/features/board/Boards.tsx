import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addBoard, selectBoards, fetchBoards } from './boardsSlice';
import { Button, Box, Typography } from '@mui/material';

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

        {/* <Button onClick={() => dispatch(addBoard("testing"))}>
          add testing column
        </Button> */}

    </>
  );
}
