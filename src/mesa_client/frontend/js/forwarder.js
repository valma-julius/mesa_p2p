const PEERJS_HOST = "mesa-vu.com";
const PEERJS_PATH = "/forwards";

if (localStorage.getItem('mesa_user') !== null && localStorage.getItem('mesa_user') !== "") {
    peerID = JSON.parse(localStorage.getItem('mesa_user')).id + "_forwarder"
    const peer =  new Peer(peerID, {
        host: PEERJS_HOST,
        path: PEERJS_PATH,
        secure: true,
        pinginterval: 100000000000000,
        debug: 1,
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
                        connection.send({ type: 'ack' });
                        console.log('Received some data, sending ack');
                        forwardMessage(data, peer);
            
                        break;
                    case 'ack':
                        console.log('Received ack');
                        connection.close();
                        break;
                    default:
                        console.log('Received without type', data);
                        break;
                }

            });
            // Send messages
            // connection.send('Hello!');
        });
    
        connection.on('close', function() {
            console.log("Main connection closed")
        });
    
        connection.on('error', function(err) {
            console.log("There has been a problem with the forwarder peer: ", err.type)
            console.log(err)
        });
    });

    peer.on('error', (error) => {
        console.log("There has been an error with the forwarding peer: ", error)
        console.log(error.type)
    })

    window.addEventListener("beforeunload", function() {
        console.log("LEAVING")
        peer.disconnect();
    });

    function forwardMessage(message, peer) {
        connection.send(message);


        console.log("Trying to send to: " + message.recipient_id + "_chat")
        connection = peer.connect(`${message.recipient_id}_chat`);

        connection.on('open', function() {
            // Send messages
            connection.send(message);

            connection.on('data', function(data) {
                switch (data.type) {
                    case 'ack':
                        console.log('Received ack');
                        connection.close();
                        return;
                    default:
                        console.log('Received without type', data);
                        break;
                }
            })
        });

        connection.on('close', function() {
            console.log("Forwarding onnection closed")
        });

        connection.on('error', function(err) {
            console.log(err)
        });
    }

}
