import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Spinner } from 'flowbite-react';

// Api
import { logout } from '../../api/user';
import useApi from '../../hooks/useApi';

// Context
import { UserContext } from '../../context/UserContext';

const Header = (props) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const logoutUser = useApi(logout);

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser.request();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="flex w-full flex-wrap items-center justify-between p-6">
      <h5
        className="text-xl font-bold cursor-pointer"
        onClick={() => {
          navigate('/');
        }}
      >
        MESA
      </h5>
      <p className="text-md font-bold">
        {user ? `Hello, ${user?.username}` : ''}
      </p>
      {user && (
        <Button
          type="submit"
          onClick={(e) => {
            handleLogout(e);
          }}
        >
          {logoutUser.loading ? (
            <div className="mr-3">
              <Spinner size="sm" light={true} />
            </div>
          ) : (
            'Sign out'
          )}
        </Button>
      )}
    </header>
  );
};

export default Header;
