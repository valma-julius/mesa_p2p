import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'flowbite-react';
import { UserContext } from '../../context/UserContext';

// Components
import Screen from '../generic/Screen';

const Hello = (props) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <div>
      <Screen>
        {!user && (
          <div className="flex flex-row w-full justify-center gap-4">
            <Button
              className="basis-1/2"
              size="lg"
              color="gray"
              onClick={() => {
                navigate('/register');
              }}
            >
              Register
            </Button>

            <Button
              className="basis-1/2"
              size="lg"
              color="gray"
              onClick={() => {
                navigate('/login');
              }}
            >
              Log In
            </Button>
          </div>
        )}

        {user && (
          <div className="flex flex-row w-full justify-center gap-4">
            <Button
              className="basis-1/2"
              size="lg"
              color="gray"
              onClick={() => {
                navigate('/chat');
              }}
            >
              Go chat!
            </Button>
            <Button
              className="basis-1/2"
              size="lg"
              color="gray"
              onClick={() => {
                navigate('/profile');
              }}
            >
              Profile info
            </Button>
          </div>
        )}
      </Screen>
    </div>
  );
};

export default Hello;
