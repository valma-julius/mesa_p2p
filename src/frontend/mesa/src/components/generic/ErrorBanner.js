import React from 'react';

// Flowbite
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';

const ErrorBanner = (props) => {
  return (
    <Alert color="failure" icon={HiInformationCircle}>
      <span>
        <span className="font-medium">There has beed an error!</span>{' '}
        {props.message}
      </span>
    </Alert>
  );
};

export default ErrorBanner;
