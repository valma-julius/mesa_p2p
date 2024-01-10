import { Badge } from 'flowbite-react';
import React from 'react';

const ChatItem = (props) => {
  const beautifyDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }

  return (
    <button className="flex flex-row justify-between items-center p-4 cursor-pointer hover:bg-slate-100 transition-colors duration-150 border-solid w-full" onClick={(e) => {
      e.preventDefault();
      props.openConversation(props.id, props.identifier)
    }}>
      <div className="flex-grow flex-shrink w-full">
        <div className="flex flex-row justify-between items-center ">
          <div>
            <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
              {props.name}
            </h5>
          </div>
          <div>
            {props.identifier == 'p2p' ? <Badge color="info">P2P</Badge> : <Badge color="gray">Normal</Badge>}
          </div>
          <div>
            <h5 className="text-md tracking-tight text-gray-300 dark:text-white">
              {beautifyDate(props.created_at)}
            </h5>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ChatItem;
