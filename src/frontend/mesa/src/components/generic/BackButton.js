import React from 'react';
import { useNavigate } from 'react-router-dom';

// Flowbite
import { Button } from 'flowbite-react';
import { IoIosArrowBack } from 'react-icons/io';

const BackButton = (props) => {
  const navigate = useNavigate();

  return (
    <Button
      className=""
      size="lg"
      color="white"
      onClick={() => {
        navigate(props.navTo);
      }}
    >
      <IoIosArrowBack />
    </Button>
  );
};

export default BackButton;
