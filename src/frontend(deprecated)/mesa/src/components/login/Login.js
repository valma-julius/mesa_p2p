import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Spinner } from 'flowbite-react';

// Api
import { login } from '../../api/user';
import useApi from '../../hooks/useApi';

// Components
import ErrorBanner from '../generic/ErrorBanner';

const Login = (props) => {
  const loginUser = useApi(login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser.request({
      username: username,
      password: password,
    });
  };

  useEffect(() => {
    loginUser.data && props.fetchUser();
    loginUser.data && navigate('/');
  }, [loginUser]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);

  useEffect(() => {
    if (username.length > 3 && password.length > 3) {
      setDisabledButton(false)
    } else {
      setDisabledButton(true)
    }
  }, [username, password])

  return (
    <div className="container mx-auto text-center">
      <p className="text-sm mb-10">Login form</p>
      <form className="flex justify-center">
        <div className="gap-2">
          <div className="mb-4">
            {loginUser.error ? (
              <ErrorBanner className="mb-4" message={loginUser.error} />
            ) : (
              ''
            )}
          </div>
          <TextInput
            id="username"
            type="text"
            placeholder="Username"
            required={true}
            className="mb-4"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            disabled={loginUser.loading}
            maxLength={20}
          />
          <TextInput
            id="password1"
            type="password"
            required={true}
            placeholder="Password"
            className="mb-4"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            disabled={loginUser.loading}
            maxLength={20}
          />
          <div className="flex flex-row w-full justify-center gap-4">
            <Button
              type="submit"
              disabled={disabledButton}
              onClick={(e) => {
                handleLogin(e);
              }}
            >
              {loginUser.loading ? (
                <div className="mr-3">
                  <Spinner size="sm" light={true} />
                </div>
              ) : (
                'Log In'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
