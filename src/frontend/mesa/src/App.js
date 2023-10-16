import logo from './logo.svg';
import './App.css';
// import Peer from 'peerjs';
import Peer from 'simple-peer'
import { createIceCandidate } from './api/user';

import { useState, useEffect, useRef } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Main from './components/main/Main';
import Hello from './components/hello/Hello';
import Profile from './components/profile/Profile';
import Register from './components/register/Register';
import Chat from './components/chat/Chat';
import Search from './components/search/Search';
import Header from './components/generic/Header';
import P2PMagic from './components/p2pMagic/P2PMagic';

// Context
import { UserContext } from './context/UserContext';

// Api
import useApi from './hooks/useApi';
import { getUser } from './api/user';
import Login from './components/login/Login';
import Conversation from './components/conversation/Conversation';
import P2PConversation from './components/p2p_conversation/P2PConversation';
import P2PConversationCP from './components/p2p_conversation/P2PConversationCP';

const App = () => {
  const getUserInfo = useApi(getUser);

  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    await getUserInfo.request();
  };

  useEffect(() => {
    if (getUserInfo.data) {
      setUser(getUserInfo.data.user);
    }
  }, [getUserInfo.data]);

  const setOpenConversation = async (conversation_id) => {
    const updatedUser = {
      ...user,
      conversation_id: conversation_id,
    };
    setUser(updatedUser);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="h-full">
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser }}>
          {user && <P2PMagic user={user}></P2PMagic>}
            <Header />
            {/* <div className="h-full flex justify-center items-start"> */}
            <Routes>
              <Route path="/main" element={<Main />} />
              <Route path="/" exact element={<Hello />} />
              <Route
                path="/register/"
                element={<Register fetchUser={fetchUser} />}
              />
              <Route path="/login/" element={<Login fetchUser={fetchUser} />} />
              <Route path="/profile/" element={<Profile />} />
              <Route path="/chat/" element={<Chat setOpenConversation={setOpenConversation} />} />
              {/* <Route path="/p2p_conversation/" element={<P2PConversation />} /> */}
              <Route path="/p2p_conversation_cp/" element={<P2PConversationCP />} />
              <Route path="/conversation/" element={<Conversation />} />
              <Route path="/search/" element={<Search />} />
            </Routes>
            {/* </div> */}
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
