import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Screen from '../generic/Screen';
import BackButton from '../generic/BackButton';

// Context
import { UserContext } from '../../context/UserContext';

// Flowbite
import { Card, Button } from 'flowbite-react';

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <Screen className="">
      <BackButton navTo="/" />
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        Your profile info{' '}
      </h1>
      <Card className="mb-4 w-full">
        <p className="mb-1 text-xm font-medium text-gray-900 dark:text-white">
          User name: {user.username}
        </p>
        <p className="mb-1 text-xm font-medium text-gray-900 dark:text-white">
          Created at: {user.created_at.split('T')[0]}
        </p>
      </Card>
      <Button
        className=""
        size="lg"
        color="red"
        onClick={() => {
          console.log('LOL');
        }}
      >
        Delete user
      </Button>
    </Screen>
  );
};

export default Profile;
