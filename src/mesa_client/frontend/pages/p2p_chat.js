if (localStorage.getItem('mesa_user') === null) {
    redirectToHome();
}

let conversation = null


document.addEventListener('DOMContentLoaded', (event) => {
    homeButton = document.getElementById("home-button");

    homeButton.addEventListener("click", () => {
        redirectToHome();
    });

    fetchConversation();

    sendButton = document.getElementById("send-button");
    sendButton.addEventListener("click", () => {
        sendMessage();
    });

    peerID = JSON.parse(localStorage.getItem('mesa_user')).id + "_chat"
    const peer =  new Peer(peerID, {
        host: PEERJS_HOST,
        port: PEERJS_PORT,
        path: PEERJS_PATH,
    });

    peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
    });

    peer.on('connection', (conn) => {
        connection = conn

        connection.on('open', function() {    
            // Receive messages
            connection.on('data', function(data) {
                console.log(data)

            });
        });

        connection.on('close', function() {
            console.log("Connection closed")
        });

        connection.on('error', function(err) {
            console.log(err)
        });
    });
});

function drawChat(conversation) {
    messagesContainer = document.getElementById("chat-container");
    localMessages = JSON.parse(localStorage.getItem(`mesa_messages_p2p_${conversation.conversation.id}`));


    if (localMessages === null) {
            
            messagesContainer.innerHTML += drawMessage(
                {
                    id: 1,
                    user_id: 2,
                    author: "asdf",
                    text: "NO MESSAGES YET ...",
                    created_at: "",
                }
            );
    } else {
        localMessages.forEach(message => {
            messagesContainer.innerHTML += drawMessage(message, JSON.parse(localStorage.getItem('mesa_user')).username);
        });
    }

    drawConversationName(conversation.conversation_name);
}

function drawConversationName(conversation_name) {
    conversationNameContainer = document.getElementById("chat-name");
    conversationNameContainer.innerHTML = conversation_name;
}

function drawMessage(message, current_username) {
    return `
        <div class="message author-${isAuthor(message, current_username)}" id="message-${message.id}">
            <p class="message-text">${message.text}</p>
            <p class="message-date">${message.created_at !== "" ? message.created_at.split("T")[0] : ""}</p>
        </div>
    `
}

function isAuthor(message, current_username) {
    return message.author === current_username
}

function fetchConversation() {
    opennedConversation = localStorage.getItem('mesa_chat');
    fetch(`${BASE_URL}/conversations/${opennedConversation}/get_conversation`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('mesa_token'),
        },
    })
    .then(response => {
        console.log(response)
        if (!response.ok) {
            return null
        }
        return response.json()
    })
    .then(response => {
        console.log(response)
        conversation = response;
        drawChat(response)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function sendMessage() {
    current_chat = localStorage.getItem('mesa_chat');
    messageText = document.getElementById("message-input").value;

    message = getMessageObject(messageText, JSON.parse(localStorage.getItem('mesa_user')).username);
    saveMessage(current_chat, message);

    sendP2PMessage(current_chat, message);
    drawMessages(current_chat);
    
    // Clearing input
    document.getElementById("message-input").value = "";
}

function getMessageObject(messageText, author) {
    return {
        id: Math.random(),
        author: author,
        text: messageText,
        created_at: new Date()
    }
}

function saveMessage(chat_id, message, author) {
    localMessages = JSON.parse(localStorage.getItem(`mesa_messages_p2p_${chat_id}`));

    if (localMessages === null) {
        localStorage.setItem(`mesa_messages_p2p_${chat_id}`, JSON.stringify([message]));
    } else {
        localMessages.push(message);
        localStorage.setItem(`mesa_messages_p2p_${chat_id}`, JSON.stringify(localMessages));
    }
}

async function sendP2PMessage(current_chat, message) {
    try {
        // Await the promise returned by getAvailableICE
        const responseJson = await getAvailableICE();

        current_user_id = JSON.parse(localStorage.getItem('mesa_user')).id;
        peer = new Peer(current_user_id, {
            host: PEERJS_HOST,
            port: PEERJS_PORT,
            path: PEERJS_PATH,
        });

        peer.on('open', (id) => {
            connection = peer.connect(`${responseJson[0].ice_id.split("_")[0]}_forwarder`);

            message.recipient_id = conversation.recipient_id;
            message.type = "p2p_forward"

            connection.on('open', function() {
                // Send messages
                connection.send(message);
            });
        });
        // Use the responseJson here
      } catch (error) {
        // Handle any errors that occurred during fetch or JSON parsing
        console.error("Failed to get ICE candidates:", error.message);
      }
}

function drawMessages(chat_id) {
    messages = JSON.parse(localStorage.getItem(`mesa_messages_p2p_${chat_id}`));
    messagesContainer = document.getElementById("chat-container");

    if (messages === null) {
        return;
    }

    messagesContainer.innerHTML += drawMessage(messages[messages.length - 1], JSON.parse(localStorage.getItem('mesa_user')).username);
}
