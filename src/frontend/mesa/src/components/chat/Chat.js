import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

// Components
import Screen from '../generic/Screen';
import ChatItem from './ChatItem';
import UserSearchBar from '../search/UserSearchBar'

// Flowbite
import { Button, ListGroup, Badge } from 'flowbite-react';

// Api
import { getConversations } from '../../api/user';
import useApi from '../../hooks/useApi';

const Chat = (props) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const getConversationsApi = useApi(getConversations);
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    conversations.length === 0 && getConversationsApi.request();
  }, [])

  useEffect(() => {
    getConversationsApi.data && console.log(getConversationsApi.data?.conversations)
    getConversationsApi.data?.conversations && setConversations([...getConversationsApi.data.conversations]);
  }, [getConversationsApi.data]);

  const openConversation = (conversation_id, identifier) => {
    console.log(`want to open: ${conversation_id}`)
    localStorage.setItem('conversation_id', conversation_id);
    if (identifier == 'p2p') {
      // navigate('/p2p_conversation');
      navigate('/p2p_conversation_cp');
    } else {
      navigate('/conversation');
    }
  }

  return (
    <Screen className="h-full flex item-start" back={true} backPath="/">
      <Button className='w-full mb-5 mt-5' onClick={() => {
        navigate("/search");
      }}>New chat</Button>
      <div className='w-full'>
        <ListGroup>
          {conversations && conversations.map((conversation) => {
            return <ChatItem key={conversation.id} name={conversation.conversation_name} created_at={conversation.created_at} openConversation={openConversation} id={conversation.id} identifier={conversation.identifier} />
          })}
        </ListGroup>
      </div>
    </Screen>
  );
};

export default Chat;
