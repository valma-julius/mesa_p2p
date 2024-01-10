import client from './client';

const register = async (user) => {
  const data = await client.post('/users', {
    user: user,
  });
  localStorage.setItem('mesa_token', await data.headers['authorization']);

  return data;
};

const getUser = () => {
  return (
    localStorage.getItem('mesa_token') &&
    client.get('/member-data', {
      headers: {
        Authorization: localStorage.getItem('mesa_token'),
      },
    })
  );
};

const login = async (user) => {
  const data = await client.post('/users/sign_in', {
    user: user,
  });

  localStorage.setItem('mesa_token', await data.headers['authorization']);

  return data;
};

const logout = async () => {
  const data = await client.delete('/users/sign_out', {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  });
  localStorage.removeItem('mesa_token');

  return data;
};

const search = async (username) => {
  const data = await client.get(`/users/search?username=${username}`, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

const createConversation = async (conversation_name, user1, user2, identifier) => {
  const data = await client.post(`/conversations`, {
    conversation: {
      name: conversation_name,
      users: [user1, user2],
      identifier: identifier
    }
  }, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

const getConversations = async () => {
  const data = await client.get('/conversations', {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  // localStorage.setItem('recipient_id', await data.);

  return data;
}

const getConversation = async () => {
  const data = await client.get(`/conversations/${localStorage.getItem('conversation_id')}/get_conversation`, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  localStorage.setItem('recipient_id', await data.data.recipient_id);

  return data;
}

const sendMessage = async (message) => {
  const data = await client.post(`/conversations/${localStorage.getItem('conversation_id')}/new_message`, {
    message: {
      text: message,
      conversation_id: localStorage.getItem('conversation_id')
    }
  }, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

const sendIpAddress = async (ip_address) => {
  const data = await client.post(`/conversations/${localStorage.getItem('conversation_id')}/send_ip_address`, {
    ip_address: {
      conversation_id: localStorage.getItem('conversation_id'),
      ip_address: ip_address
    }
  }, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

const createIceCandidate = async (ice) => {
  const data = await client.post(`/create_ice_candidate`, {
    ice: ice
  }, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

const removeIceCandidate = async () => {
  const data = await client.delete(`/remove_ice_candidate`, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

const getAvailableIceCandidates = async () => {
  const data = await client.get(`/get_available_ice_candidates`, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

const createP2PTransaction = async (conversation_id) => {
  const data = await client.post(`/create_p2p_transaction`, {
    conversation_id: conversation_id
  }, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

const getForwardingDestination = async (path_id, peer_role) => {
  const data = await client.post(`/p2p_paths/${path_id}/request_send_p2p_message`, {
    peer_role: peer_role
  }, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  console.log(await data)

  return data;
}

const editMessage = async (message_id, message_content) => {
  const data = await client.patch(`/conversations/${localStorage.getItem('conversation_id')}/edit_message`, {
    message_id: message_id,
    message_content: message_content
  }, {
    headers: {
      Authorization: localStorage.getItem('mesa_token'),
    },
  })

  return data;
}

export { register, getUser, login, logout, search, createConversation, getConversations, getConversation, sendMessage, sendIpAddress, createIceCandidate, removeIceCandidate, getAvailableIceCandidates, createP2PTransaction, getForwardingDestination, editMessage };
