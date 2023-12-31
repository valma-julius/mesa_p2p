if (localStorage.getItem('mesa_user') === null) {
    redirectToHome();
}

let conversation = null
let recepientPubKey = null


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
        path: PEERJS_PATH,
        secure: true,
        pinginterval: 100000000000000,
        debug: 1,
    });

    peer.on('open', (id) => {
        console.log("PEER IS OPENED, MAIN ONE")
    });

    // peer.on('open', (id) => {
        peer.on('connection', (conn) => {
            conn.on('open', function() {    
                // Receive messages
                conn.on('data', function(data) {
                    console.log("received some data, sending ack")

                    // Experiment on receiving time
                    console.log("-----------------------------------------------")
                    console.log("Received at: ", Date.now())
                    console.log("-----------------------------------------------")

                    conn.send({ type: 'ack' })

                    current_chat = localStorage.getItem('mesa_chat');

                    decryptMessage(data.text)
                    .then(decryptedMessage => {
                        messageText = decryptedMessage;

                        if (current_chat === data.chat_id) {
                            message = getMessageObject(messageText, data.author, current_chat);
                            saveMessage(current_chat, message);
                            drawMessages(current_chat);
                        } else {
                            current_chat = data.chat_id;
                            message = getMessageObject(messageText, data.author, current_chat);
                            saveMessage(current_chat, message);
                            showNewMessageBanner(message.author);
                        }
                    })
                    .catch(error => {
                        console.error("Decryption failed:", error);
                    });
                });
            });

            conn.on('close', function() {
                console.log("Main connection closed")
            });

            conn.on('error', function(err) {
                console.log(err.type)
            });
        });
    // });

    peer.on('error', (error) => {
        console.log("There has been an error with the main peer: ", error)
        console.log(error.type)
        showRefreshBanner();
    })

    window.addEventListener("beforeunload", function() {
        console.log("LEAVING")
        peer.disconnect();
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

    drawConversationName(conversation.conversation_name, conversation.recipient_active);
}

function drawConversationName(conversation_name, recipient_active) {
    conversationNameContainer = document.getElementById("chat-name");
    conversation_name = recipient_active ? `${conversation_name} 🟢` : `${conversation_name} 🔴`;
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
        if (!response.ok) {
            return null
        }
        return response.json()
    })
    .then(response => {
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

    // Experiment on sending time
    console.log("-----------------------------------------------")
    console.log("Started to send at: ", Date.now())
    console.log("-----------------------------------------------")

    recipientPubKey = conversation.recipient_public_key;

    encryptedMessage = encryptMessage(messageText, recipientPubKey);
    encryptedMessage.then(encryptedMessage => {
        messageToSend = getMessageObject(encryptedMessage, JSON.parse(localStorage.getItem('mesa_user')).username, current_chat);
        messageToSave = getMessageObject(messageText, JSON.parse(localStorage.getItem('mesa_user')).username, current_chat);

        sendP2PMessage(current_chat, messageToSend);
        saveMessage(current_chat, messageToSave);

        drawMessages(current_chat);
    })
    
    // Clearing input
    document.getElementById("message-input").value = "";
}

function getMessageObject(messageText, author, chat_id) {
    return {
        id: Math.random(),
        author: author,
        text: messageText,
        chat_id: chat_id,
        created_at: new Date()
    }
}

function saveMessage(chat_id, message) {
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
        const responseJson = await getAvailableICE(conversation.conversation.id);

        current_user_id = JSON.parse(localStorage.getItem('mesa_user')).id;
        peer = new Peer(current_user_id + "_sending", {
            host: PEERJS_HOST,
            path: PEERJS_PATH,
            secure: true,
            pinginterval: 100000000000000,
            debug: 1,
        });

        peer.on('open', (id) => {
            console.log("Sending to: ", `${responseJson[0].ice_id.split("_")[0]}_forwarder`);
            connection = peer.connect(`${responseJson[0].ice_id.split("_")[0]}_forwarder`);

            message.recipient_id = conversation.recipient_id;
            message.type = "p2p_forward"

            connection.on('open', function() {
                console.log("sending message");
                // Send messages
                connection.send(message);
            });

            connection.on('data', function(data) {
                if (data.type === "ack") {
                    console.log("ACK received")
                    connection.close();
                }
            })


            connection.on('close', function() {
                console.log("Sending connection closed");

                // Optionally destroy the peer object if it's not going to be reused
                peer.destroy();
            });

            connection.on('error', function(err) {
                console.error("Connection error:", err);
                connection.close(); // Make sure to close the connection on error
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
