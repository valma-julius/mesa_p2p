import React, { useContext, useState, useEffect, useRef } from 'react';
import ActionCable from 'actioncable';
import { UserContext } from '../../context/UserContext';

// Components
import Screen from '../generic/Screen';
import Message from '../conversation/Message';

// Flowbite
import { TextInput, Button, Badge } from 'flowbite-react';

// Api
import { sendIpAddress, getConversation } from '../../api/user';
import useApi from '../../hooks/useApi';

// Peer js
import Peer from 'peerjs'

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun.services.mozilla.com' }
    ]
}

const RECIPIENT_ID = localStorage.getItem('recipient_id')

const peer = new Peer();

const P2PConversation = () => {
    const { user } = useContext(UserContext);
    const message_content = useRef(null);
    const chatSubscription = useRef(null);
    const peer1Id = useRef(null);
    const peer2Id = useRef(null);

    const getConversationApi = useApi(getConversation);

    const [conversation, setConversation] = useState(null);
    // const [chatSubscription, setChatSubscription] = useState(null);
    const [receiverActive, setReceiverActive] = useState(false);
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null);
    const [messages, setMessages] = useState([])

    const conversation_id = () => {
        return localStorage.getItem('conversation_id');
    }

    const cable = ActionCable.createConsumer(
        `ws://127.0.0.1:7777/cable?jwt=${localStorage.getItem('mesa_token').split(' ')[1]}&conversation_id=${conversation_id}`
    );

    useEffect(() => {
        !conversation && getConversationApi.request();

        let stored_conversation = JSON.parse(localStorage.getItem(`p2p_conversation_${conversation_id()}`));
        console.log(stored_conversation)
        stored_conversation !== null && setMessages(stored_conversation)

        if (!chatSubscription.current) {
            const subscription = cable.subscriptions.create(
                {
                    channel: "P2pChatChannel",
                    jwt: localStorage.getItem("mesa_token").split(" ")[1],
                    conversation_id: conversation_id(),
                },
                {
                    received: (message) => {
                        switch (message.type) {
                            case "offer_to_connect":
                                connection_offer(message.author_id, message.conversation_id);
                            case "offer_accepted":
                                offer_accepted(message.author_id, message.conversation_id);
                            case "peer_id_from_another_user":
                                peer_id_from_another_user(message.author_id, message.message);
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
        getConversationApi.data && setConversation({ ...getConversationApi.data });

    }, [getConversationApi.data]);

    const send_message = (command, message) => {
        chatSubscription.current.send({
            command: command,
            message: message,
        });
    };


    const connection_offer = (author_id, conversation_id) => {
        if (author_id == RECIPIENT_ID) {
            setReceiverActive(true)
            console.log('Hello!')
            send_message('offer_accepted', 'hey, have not seend you for long!')
        }
    }

    const offer_accepted = (author_id, conversation_id) => {
        if (author_id == RECIPIENT_ID) {
            setReceiverActive(true)
            // const rtcConnection = new RTCPeerConnection(ICE_SERVERS)
            // console.log(rtcConnection)
            // rtcConnection.onicecandidate = on_ice_candidate;
            // setRtcPeerConnection(rtcConnection)
        }
    }

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
        let conn = peer.connect(peer2Id.current);

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

    const setLocalMessages = (message) => {
        let stored_conversation = JSON.parse(localStorage.getItem(`p2p_conversation_${conversation_id()}`));
        if (stored_conversation == null) {
            stored_conversation = new Array(message)
        } else {

            stored_conversation.push(message);
        }
        localStorage.setItem(`p2p_conversation_${conversation_id()}`, JSON.stringify(stored_conversation))
    }


    // const on_ice_candidate = (event) => {
    //     console.log("HELLO FROM ICE")
    //     console.log(event)
    //     if (event.candidate) {
    //         send_message('candidate', event.candidate);
    //         console.log("Sending the candidate");
    //     }
    // }


    return (
        <Screen back={true} backPath="/chat" title={`P2P Chat with: ${conversation?.conversation_name}`} p2p_chat={receiverActive} is_p2p_chat={true}>
            {/* {!receiverActive && <Button onClick={() => { send_message('connect_to_peer', 'hello, peer') }} className='mb-5'>
                Connect with {conversation?.conversation_name}
            </Button>} */}
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
                    maxLength={100}
                />
                <Button onClick={() => { send_p2p_message() }} >
                    Send
                </Button>
            </div>
        </Screen>
    );
};

export default P2PConversation;