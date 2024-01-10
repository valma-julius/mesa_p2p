import React, { useContext, useState, useEffect, useRef } from 'react';
import ActionCable from 'actioncable';
import { UserContext } from '../../context/UserContext';

// Components
import Screen from '../generic/Screen';
import Message from '../conversation/Message';

// Flowbite
import { TextInput, Button, Badge } from 'flowbite-react';

// Api
import { createP2PTransaction, getConversation, createIceCandidate, getForwardingDestination } from '../../api/user';
import useApi from '../../hooks/useApi';

// Emmit
import EventBus from '../../events/EventBus';

// Peer js
import Peer from 'peerjs'

const RECIPIENT_ID = localStorage.getItem('recipient_id')
let transaction = null;

const peer = new Peer();

const P2PConversationCP = () => {
    const { user } = useContext(UserContext);
    const message_content = useRef(null);
    const getConversationApi = useApi(getConversation);

    const [conversation, setConversation] = useState(null);
    const [receiverActive, setReceiverActive] = useState(false);
    const [messages, setMessages] = useState([])

    const conversation_id = () => {
        return localStorage.getItem('conversation_id');
    }

    useEffect(() => {
        !conversation && getConversationApi.request();

        // Gettin messages from local files
        let stored_conversation = JSON.parse(localStorage.getItem(`p2p_conversation_${conversation_id()}`));
        stored_conversation !== null && setMessages(stored_conversation)

    }, [])

    useEffect(() => {
        getConversationApi.data && setConversation({ ...getConversationApi.data });

    }, [getConversationApi.data]);

    const updateLocalMessages = (message) => {
        let stored_conversation = JSON.parse(localStorage.getItem(`p2p_conversation_${conversation_id()}`));
        if (stored_conversation == null) {
            stored_conversation = new Array(message)
        } else {

            stored_conversation.push(message);
        }
        localStorage.setItem(`p2p_conversation_${conversation_id()}`, JSON.stringify(stored_conversation))
    }

    const p2p_send = (message) => {
        let sent_message = {
            id: Math.random(),
            text: message_content.current.value,
            owner: true,
            author: user.username,
            receiver: RECIPIENT_ID,
            created_at: Date.now()
        }

        setMessages(oldMessages => [...oldMessages, sent_message]);
        updateLocalMessages(sent_message);
        message.current.value = null

        // Emit event to p2p side
        emmitMessageSent(sent_message)
    }

    function emmitMessageSent(message) {
        EventBus.emit('message', {
            type: 'p2p_send_message',
            receiver: RECIPIENT_ID,
            message: message.text,
            conversation_id: conversation_id()
        });
    }

    return (
        <Screen back={true} backPath="/chat" title={`P2P Chat with: ${conversation?.conversation_name}`} p2p_chat={receiverActive} is_p2p_chat={true}>
            <div className='h-full'>
                {messages && messages.map((message) => {
                    return <Message key={Math.random()} message={message.text} owner={message.owner} author={message.author} time={message.created_at} />
                })}
            </div>
            <div className='flex'>
                <TextInput
                    id="large"
                    type="text"
                    className='w-full'
                    ref={message_content}
                    onKeyPress={(e) => { e.charCode == '13' && p2p_send(message_content) }}
                />
                <Button onClick={() => { p2p_send(message_content) }} >
                    Send
                </Button>
            </div>
        </Screen>
    );
};

export default P2PConversationCP;
