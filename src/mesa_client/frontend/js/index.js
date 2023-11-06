const PEERJS_HOST = "localhost";
const PEERJS_PORT = 9000;
const PEERJS_PATH = "/";

let connection

peerID = Math.floor(Math.random() * 10);
const peer =  new Peer(peerID, {
    host: PEERJS_HOST,
    port: PEERJS_PORT,
    path: PEERJS_PATH,
});

peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    document.getElementById("my-peer").innerHTML = `My peer id is: ${id}`;
});

peer.on('connection', (conn) => {
    connection = conn

    connection.on('open', function() {
        connectionStatus("connected")

        // Receive messages
        connection.on('data', function(data) {
            console.log('Received', data);
        });
    
        // Send messages
        connection.send('Hello!');
    });

    connection.on('close', function() {
        connection = null
        connectionStatus("disconnected")
    });

    connection.on('error', function(err) {
        console.log(err)
    });
});

function connectionStatus(status) {
    if (status === "connected") {
        document.getElementById("connection-status").innerHTML = "Connection status 🟢"
    } else {
        document.getElementById("connection-status").innerHTML = "Connection status 🛑"
    }
}
// Event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    // Your code here
    let connectButton = document.getElementById("connect");
    let connectionID = document.getElementById("connection-id");

    connectButton.addEventListener("click", () => {
        console.log("TRYING TO CONNECT")
        connection = peer.connect(connectionID.value);

        connection.on('open', function() {
            connectionStatus("connected")

            // Receive messages
            connection.on('data', function(data) {
                console.log('Received', data);
            });
        
            // Send messages
            connection.send('Hello!');
        });
    })

    let sendButton = document.getElementById("send");
    let message = document.getElementById("message");

    sendButton.addEventListener("click", () => {
        console.log("SENDING MESSAGE")
        connection.send(message.value)
        message.value = ""
    })

    let disconnectButton = document.getElementById("disconnect");

    disconnectButton.addEventListener("click", () => {
        console.log("DISCONNECTING")
        connection.close()
        connectionStatus("disconnected")
    });
});
