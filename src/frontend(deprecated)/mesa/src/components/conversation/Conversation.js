import React, { useContext, useState, useEffect, useRef } from 'react';
import ActionCable from 'actioncable';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

// Components
import Screen from '../generic/Screen';
import Message from './Message';

// Flowbite
import { TextInput, Button } from 'flowbite-react';

// Api
import { sendMessage, getConversation, editMessage } from '../../api/user';
import useApi from '../../hooks/useApi';

const Conversation = () => {
    const { user } = useContext(UserContext);
    const message_content = useRef(null);

    const getConversationApi = useApi(getConversation);
    const sendMessageApi = useApi(sendMessage);
    const editMessageApi = useApi(editMessage)

    const [conversation, setConversation] = useState(null);
    const [edit, setEdit] = useState(false);
    const [editMessageId, setEditMessageId] = useState(null);

    useEffect(() => {
        !conversation && getConversationApi.request();

        const cable = ActionCable.createConsumer(`ws://127.0.0.1:7777/cable?jwt=${localStorage.getItem('mesa_token').split(' ')[1]}`);

        const subscription = cable.subscriptions.create('SignalingChannel', {
            connected: () => {
                console.log('Connected to SignalingChannel');
            },
            disconnected: () => {
                console.log('Disconnected from SignalingChannel');
            },
            received: (data) => {
                console.log('Received data:', data);

                updateChat();
            },
        });

        return () => {
            cable.subscriptions.remove(subscription);
        };
    }, [])

    useEffect(() => {
        getConversationApi.data && setConversation({ ...getConversationApi.data });
    }, [getConversationApi.data]);

    const updateChat = async () => {
        getConversationApi.request();
    }

    const handleSendMessage = async () => {
        if (edit && message_content.current.value.length > 0) {
            editMessageApi.request(editMessageId, message_content.current.value);
            message_content.current.value = null
            setEdit(false);
            setEditMessageId(null);
        } else if (message_content.current.value.length > 0) {
            sendMessageApi.request(message_content.current.value);
            message_content.current.value = null
        }
    }

    const handleEditMessage = (message_id, message_content) => {
        console.log(message_content)
        setEdit(true);
        setEditMessageId(message_id)
        // message_content.current.value = 'asdf';
    }

    useEffect(() => {
        (sendMessageApi.data || editMessageApi.data) && updateChat();
    }, [sendMessageApi.data, editMessageApi.data]);

    return (
        <Screen back={true} backPath="/chat" title={`Chat with: ${conversation?.conversation_name}`}>
            <div className='flex flex-col flex-grow h-1/2 p-4 overflow-auto'>
                {conversation?.conversation_messages && conversation?.conversation_messages?.map((message) => {
                    return <Message edit={handleEditMessage} key={message.id} message_id={message.id} message={message.text} owner={message.user_id == user.id} author={message.author} time={message.created_at} />
                })}
            </div>
            <div className='flex'>
                <TextInput
                    id="large"
                    type="text"
                    className='w-full'
                    placeholder='New message...'
                    ref={message_content}
                    onKeyPress={(e) => { e.charCode == '13' && handleSendMessage() }}
                    maxLength={100}
                />
                <Button color={`${edit ? 'red' : 'blue'}`} onClick={() => { handleSendMessage() }}>{edit ? 'Send Edit' : 'Send'}</Button>
            </div>
        </Screen>
    );
};

export default Conversation;
