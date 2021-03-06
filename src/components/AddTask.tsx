import React, { FC, useState, useContext } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { TextField, IconButton, Card } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import dayjs from 'dayjs';

import useAddFirestoreTask from '../hooks/useAddFirestorexTask';
import { AuthContext } from '../contexts/Auth';

import Task from '../types/task';

type Props = {
  setErrorMessage: (errorMessage: string) => void;
  setTasks: (task: Task[]) => void;
  tasks: Task[];
};

const container = css({
  display: 'flex',
  alignItems: 'center',
});

const input = css({
  flexGrow: 1,
});

const AddTask: FC<Props> = ({ setErrorMessage, setTasks, tasks }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const { user } = useContext(AuthContext);

  const { uid } = user;
  const { addFirestoreTask } = useAddFirestoreTask(uid);

  const changeTaskTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(event.target.value);
  };

  const addTask = () => {
    const task: Task = {
      id: '',
      title: taskTitle,
      expirationDate: dayjs(),
      dueDate: dayjs(),
      memo: '',
      repeat: 'none',
    };

    addFirestoreTask(task)
      .then((e) => {
        setTaskTitle('');
        setTasks([...tasks, { ...task, id: e.id.toString() }]);
      })
      .catch(() => {
        setErrorMessage(
          'タスクの追加に失敗しました。時間をおいて再度実行してください',
        );
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <Card css={container}>
      <IconButton onClick={addTask}>
        <AddIcon />
      </IconButton>
      <TextField
        css={input}
        label="タスクを追加する"
        onChange={changeTaskTitle}
        value={taskTitle}
        onKeyDown={handleKeyPress}
      />
    </Card>
  );
};

export default AddTask;
