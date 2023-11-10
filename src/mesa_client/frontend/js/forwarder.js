const PEERJS_HOST = "localhost";
const PEERJS_PORT = 9000;
const PEERJS_PATH = "/";

if (localStorage.getItem('mesa_user') !== null && localStorage.getItem('mesa_user') !== "") {
    peerID = JSON.parse(localStorage.getItem('mesa_user')).id + "_forwarder"
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
                console.log(data.type)
                switch (data.type) {
                    case 'p2p_forward':
                        console.log('Received', data);
                        forwardMessage(data, peer);
                        break;
                    default:
                        console.log('Received without type', data);
                        break;
                }

            });
            // Send messages
            connection.send('Hello!');
        });
    
        connection.on('close', function() {
            console.log("Connection closed")
        });
    
        connection.on('error', function(err) {
            console.log(err)
        });
    });

    function forwardMessage(message, peer) {
        connection.send(message);


        console.log("TrYING to SEND to: " + message.recipient_id + "_chat")
        connection = peer.connect(`${message.recipient_id}_chat`);

        connection.on('open', function() {
            // Send messages
            connection.send(message);
        });
    }

}