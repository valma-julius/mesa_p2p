document.addEventListener('DOMContentLoaded', (event) => {
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

                    // current_chat = localStorage.getItem('mesa_chat');

                    decryptMessage(data.text)
                    .then(decryptedMessage => {
                        messageText = decryptedMessage;
                        current_chat = data.chat_id;
                        message = getMessageObject(messageText, data.author, current_chat);
                        saveMessage(current_chat, message);
                        showNewMessageBanner(message.author);
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
                console.log("there is an error with connection")
                console.log(err.type)
            });
        });
    // });

    peer.on('error', (error) => {
        console.log("There has been an error with the main peer: ", error)
        console.log(error.type)
    })

    window.addEventListener("beforeunload", function() {
        console.log("LEAVING")
        peer.disconnect();
    });
});

function saveMessage(chat_id, message) {
    localMessages = JSON.parse(localStorage.getItem(`mesa_messages_p2p_${chat_id}`));

    if (localMessages === null) {
        localStorage.setItem(`mesa_messages_p2p_${chat_id}`, JSON.stringify([message]));
    } else {
        localMessages.push(message);
        localStorage.setItem(`mesa_messages_p2p_${chat_id}`, JSON.stringify(localMessages));
    }
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

