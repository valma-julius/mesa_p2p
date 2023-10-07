import React from 'react';

import BackButton from '../generic/BackButton';

import { Badge } from 'flowbite-react'

const P2PBadge = (active) => {
  return active ? <Badge color="info">Connected</Badge> : <Badge color="gray">Not Connected</Badge>

}

const Screen = (props) => {
  return (
    <div className='flex flex-col p-2'>
      <div className='flex justify-between items-center'>
        {props.back && <BackButton navTo={props.backPath} />}
        {props.is_p2p_chat && (props.p2p_chat ? <Badge color="info">Connected</Badge> : <Badge color="gray">Not Connected</Badge>)}
        {props.title && <div className='p-6'>{props.title}</div>}
      </div>
      <div className='flex flex-col'>
        {props.children}
      </div>
    </div>
  );
};

export default Screen;
