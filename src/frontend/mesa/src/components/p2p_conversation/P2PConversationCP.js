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

// Peer js
import Peer from 'peerjs'

const RECIPIENT_ID = localStorage.getItem('recipient_id')
let transaction = null;

const peer = new Peer();

const P2PConversationCP = () => {
    const { user } = useContext(UserContext);
    const message_content = useRef(null);
    const chatSubscription = useRef(null);
    const peer1Id = useRef(null);
    const peer2Id = useRef(null);

    const getConversationApi = useApi(getConversation);
    const createIceApi = useApi(createIceCandidate)
    const createP2PTransactionApi = useApi(createP2PTransaction);
    const getForwardingDestinationApi = useApi(getForwardingDestination);

    const [conversation, setConversation] = useState(null);
    const [receiverActive, setReceiverActive] = useState(false);
    const [messages, setMessages] = useState([])

    const conversation_id = () => {
        return localStorage.getItem('conversation_id');
    }

    const cable = ActionCable.createConsumer(
        `ws://127.0.0.1:7777/cable?jwt=${localStorage.getItem('mesa_token').split(' ')[1]}`
    );

    useEffect(() => {
        !conversation && getConversationApi.request();

        // Gettin messages from local files
        let stored_conversation = JSON.parse(localStorage.getItem(`p2p_conversation_${conversation_id()}`));
        stored_conversation !== null && setMessages(stored_conversation)

        if (!chatSubscription.current) {
            const subscription = cable.subscriptions.create(
                {
                    channel: "BackgroundJobsChannel",
                    jwt: localStorage.getItem("mesa_token").split(" ")[1],
                },
                {
                    received: (message) => {
                        console.log(message)
                        console.log(message?.event)
                        if (message.event == 'expect_transaction') {
                            excpectForward(message)
                        }
                    },
                }
            );

            chatSubscription.current = subscription;
        }

        peer.on('open', (id) => {
            console.log(`My peer id is: ${id}`)
            peer1Id.current = id
            send_message('peer_id_offer', id)
        })

        peer.on('connection', function (conn) {
            conn.on('data', function (data) {
                console.log("HERE")
                console.log(conn.peer)
                peer2Id.current = conn.peer;
                setReceiverActive(true)
                console.log(data);
                if (data.type == 'message') {
                    console.log("IT IS A MESSAGE")
                    let sent_message = {
                        id: Math.random(),
                        text: data.message,
                        owner: false,
                        author: data.author || RECIPIENT_ID,
                        created_at: Date.now()
                    }
                    setMessages(oldMessages => [...oldMessages, sent_message]);
                    setLocalMessages(sent_message);
                }
            });
        });
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (peer !== null) {
                createIceApi.request(peer.id);
            }
        }, 10000)

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        getConversationApi.data && setConversation({ ...getConversationApi.data });

    }, [getConversationApi.data]);

    const send_message = (command, message) => {
        chatSubscription.current.send({
            command: command,
            message: message,
        });
    };

    const peer_id_from_another_user = (author_id, id) => {
        if (author_id == RECIPIENT_ID) {
            console.log(`Another peer id: ${id}`)
            peer2Id.current = id;

            let conn = peer.connect(id);
            conn.on('open', () => {
                let rd = Math.random()
                console.log(`Sending the message with ${rd}`)
                setReceiverActive(true)
                conn.send(`Hi from ${rd}`);
            });
        }
    }

    const send_p2p_message = () => {
        createP2PTransactionApi.request(conversation_id())
    }

    const setLocalMessages = (message) => {
        let stored_conversation = JSON.parse(localStorage.getItem(`p2p_conversation_${conversation_id()}`));
        if (stored_conversation == null) {
            stored_conversation = new Array(message)
        } else {

            stored_conversation.push(message);
        }
        localStorage.setItem(`p2p_conversation_${conversation_id()}`, JSON.stringify(stored_conversation))
    }

    const createTransaction = () => {
        createP2PTransactionApi.request(conversation_id())
    }

    useEffect(() => {
        createP2PTransactionApi.data && console.log(createP2PTransactionApi.data);

        if (createP2PTransactionApi.data) {
            transaction = createP2PTransactionApi.data;
            getForwardingDestinationApi.request(transaction.p2p_path.id, 'sender_id')
        }

    }, [createP2PTransactionApi.data]);

    useEffect(() => {
        getForwardingDestinationApi.data && console.log(getForwardingDestinationApi.data);

    }, [getForwardingDestinationApi.data]);

    const excpectForward = (args) => {
        let conn = peer.connect(args.sender_ice);
        conn.on('open', () => {
            let rd = Math.random()
            console.log(`Sending the message with ${rd}`)
            conn.send(`Hi from ${rd}`);
        });
    }

    const p2p_send = (receiver, message) => {
        let conn = peer.connect(receiver);

        conn.on('open', () => {
            setReceiverActive(true)
            conn.send({ message: message_content.current.value, type: 'message', author: user.username });

            let sent_message = {
                id: Math.random(),
                text: message_content.current.value,
                owner: true,
                author: user.username,
                created_at: Date.now()
            }

            setMessages(oldMessages => [...oldMessages, sent_message]);
            setLocalMessages(sent_message);
            message_content.current.value = null
        });
    }


    return (
        <Screen back={true} backPath="/chat" title={`P2P Chat with: ${conversation?.conversation_name}`} p2p_chat={receiverActive} is_p2p_chat={true}>
            <div className='h-full'>
                {messages && messages.map((message) => {
                    return <Message key={message.id} message={message.text} owner={message.owner} author={message.author} time={message.created_at} />
                })}
            </div>
            <div className='flex'>
                <TextInput
                    id="large"
                    type="text"
                    className='w-full'
                    ref={message_content}
                    onKeyPress={(e) => { e.charCode == '13' && send_p2p_message() }}
                />
                <Button onClick={() => { send_p2p_message() }} >
                    Send
                </Button>
                <Button onClick={() => { createTransaction() }} >
                    create transaction
                </Button>
            </div>
        </Screen>
    );
};

export default P2PConversationCP;