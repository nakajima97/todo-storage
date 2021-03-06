import React, { FC, useState, useContext } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useHistory } from 'react-router-dom';

import firebase from '../config/Firebase';
import { AuthContext } from '../contexts/Auth';

const container = css({
  width: '100%',
  textAlign: 'center',
});

const Singup: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useContext(AuthContext);
  const history = useHistory();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const createAccount = async () => {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential?.user;
      if (user !== null) {
        await user.updateProfile({ displayName: userName });
        setUser({ uid: user.uid, displayName: userName });
        history.push('/tasks/all');
      } else {
        setErrorMessage(
          'ユーザの登録に失敗しました。時間をおいて再度登録してください。',
        );
      }
    } catch {
      setErrorMessage(
        'ユーザの登録に失敗しました。時間をおいて再度登録してください。',
      );
    }
  };

  return (
    <div css={container}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Typography variant="h5">ToDo Storageにアカウントを作成する</Typography>
      <form>
        <div>
          <TextField
            type="text"
            placeholder="ユーザ名"
            margin="normal"
            onChange={handleUserChange}
            autoFocus
          />
        </div>
        <div>
          <TextField
            type="email"
            placeholder="メールアドレス"
            margin="normal"
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <TextField
            type="password"
            placeholder="パスワード"
            margin="normal"
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={createAccount}>
            アカウントを作成
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Singup;
