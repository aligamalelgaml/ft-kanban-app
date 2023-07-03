import React, { useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addTodoColumn, selectBoards, fetchBoards } from './boardsSlice';
import { Button } from '@mui/material';

export function Boards() {
  const boards = useAppSelector(selectBoards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBoards());
  }, [])

  return (
    <>
    {console.log(boards)}
    <Button onClick={() => dispatch(addTodoColumn("testing"))}>
    add testing column
    </Button>

    </>
  );
}
