import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

import { Card, Button, ListGroup, Modal, TextInput } from 'flowbite-react';

// Components
import Screen from '../generic/Screen';
import UserSearchBar from './UserSearchBar'
import BackButton from '../generic/BackButton';

// Api
import { search, createConversation } from '../../api/user';
import useApi from '../../hooks/useApi';

// Flowbite

const Search = () => {
    const navigate = useNavigate();
    const searchUserApi = useApi(search);
    const createConversationApi = useApi(createConversation);

    const { user } = useContext(UserContext);

    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [chatUser, setChatUser] = useState(null)
    const chatnameRef = useRef(null);

    const searchUser = async (username) => {
        searchUserApi.request(username);
    }

    useEffect(() => {
        searchUserApi.data && console.log(searchUserApi.data.users)
        searchUserApi.data?.users && setUsersResult(searchUserApi.data.users);
    }, [searchUserApi.data]);

    const setUsersResult = (users) => {
        setUsers([...users]);
    }

    const startNewChat = async (chat_user) => {
        console.log(`Want to start a chat with ${chat_user.username}`)
        setChatUser(chat_user);
        setShowModal(true);
    }

    const handleNormalConversationCreation = async () => {
        createConversationApi.request('placeholder', user.id, chatUser.id, 'normal');
        setShowModal(false);
        navigate("/chat");
    }

    const handleP2PConversationCreation = async () => {
        createConversationApi.request('placeholder', user.id, chatUser.id, 'p2p');
        setShowModal(false);
        navigate("/chat");
    }

    useEffect(() => {
        createConversationApi.data && console.log(searchUserApi.data)
    }, [createConversationApi.data]);

    return (
        <Screen className="h-full flex item-start" back={true} backPath="/chat">
            <UserSearchBar searchUser={searchUser} />
            <div>
                {users && users.map((chat_user) => {
                    return (<ListGroup.Item className='w-full' onClick={() => { startNewChat(chat_user) }} key="1">
                        <div className="flex flex-row justify-around items-center p-4">
                            <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                                {chat_user.username}
                            </h5>
                        </div>
                    </ListGroup.Item>)

                })}
                {users && users.length === 0 && <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">No users found!</h5>}
            </div>
            <Modal
                show={showModal}
            >
                <Modal.Body>
                    <div className='flex items-center justify-center gap-4'>
                        <Button color="gray" onClick={() => { handleNormalConversationCreation() }}>Normal chat</Button>
                        <Button color="purple" onClick={() => { handleP2PConversationCreation() }}>P2P chat</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Screen>
    );
};

export default Search;
