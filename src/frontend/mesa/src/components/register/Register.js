import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Spinner } from 'flowbite-react';

// Api
import { register } from '../../api/user';
import useApi from '../../hooks/useApi';

// Context

// Components
import ErrorBanner from '../generic/ErrorBanner';

const Register = (props) => {
  const registerUser = useApi(register);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    registerUser.request({
      username: username,
      password: password,
      password_confirmation: rPassword,
    });
  };

  useEffect(() => {
    registerUser.data && props.fetchUser();
    registerUser.data && navigate('/');
  }, [registerUser]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);

  useEffect(() => {
    if (username.length > 3 && password.length > 3 && rPassword.length > 3) {
      setDisabledButton(false)
    } else {
      setDisabledButton(true)
    }
  }, [username, password, rPassword])

  return (
    <div className="container mx-auto text-center">
      <p className="text-sm mb-10">Register form</p>
      <form className="flex justify-center">
        <div className="gap-2">
          <div className="mb-4">
            {registerUser.error ? (
              <ErrorBanner className="mb-4" message={registerUser.error} />
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
            disabled={registerUser.loading}
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
            disabled={registerUser.loading}
            maxLength={20}
          />
          <TextInput
            id="password1"
            type="password"
            required={true}
            placeholder="Repeat password"
            className="mb-4"
            value={rPassword}
            onChange={({ target }) => setRPassword(target.value)}
            disabled={registerUser.loading}
            maxLength={20}
          />
          <div className="flex flex-row w-full justify-center gap-4">
            <Button
              type="submit"
              disabled={disabledButton}
              onClick={(e) => {
                handleRegister(e);
              }}
            >
              {registerUser.loading ? (
                <div className="mr-3">
                  <Spinner size="sm" light={true} />
                </div>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
