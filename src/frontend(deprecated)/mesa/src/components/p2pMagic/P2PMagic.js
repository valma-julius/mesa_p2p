import React, { useContext, useEffect, useState }  from "react";

// PeerJS things
import { Peer } from "peerjs";

// Events
import EventBus from "../../events/EventBus";

// Api
import { createIceCandidate, removeIceCandidate, getAvailableIceCandidates } from "../../api/user";
import useApi from "../../hooks/useApi";

const PEERJS_HOST = "localhost";
const PEERJS_PORT = 9000;
const PEERJS_PATH = "/";

function newPeerConnection(peer, id) {
    let connection = peer.connect(id);
    console.log(connection)

    sendPing(connection)
    console.log("Connection succeeded")
    
    return connection;
}

function sendPing (connection) {
    connection.on('open', async () => {
        connection.send('ping')
    })
}

function sendMessage(p2pConnection, message) {
    if (!p2pConnection) {
        console.log("WHAT")
        return
    }

    p2pConnection.send(message)
}



const P2PMagic = (props) => {
    // Api stuff
    const sendActive = useApi(createIceCandidate)
    const removeActive = useApi(removeIceCandidate)
    const getActive = useApi(getAvailableIceCandidates)

    const user = props.user
    const [peer, setPeer] = useState(null)
    const [tempPeer, setTempPeer] = useState(null)
    const [peerID, setPeerID] = useState(null)
    const [p2pConnection, setP2PConnection] = useState(null)
    const [activePeers, setActivePeers] = useState([])
    const [messageToSend, setMessageToSend] = useState(null)

    useEffect(() => {
        setPeerID(user.id)

        let peerVar = new Peer(peerID, {
            host: PEERJS_HOST,
            port: PEERJS_PORT,
            path: PEERJS_PATH,
        });
        setPeer(peerVar)

        sendActive.request(peerID);

        // Get list of active peers
        getActive.request()

        EventBus.on('message', handleEventMessage)
    
        return () => {
            peerVar.disconnect();
            removeActive.request();
        };
    }, [])

    useEffect(() => {
        if (getActive.data) {
            setActivePeers(getActive.data)
        }
    }, [getActive.data])

    async function handleEventMessage(event) {
        switch(event.type) {
            case 'p2p_send_message':
                console.log("P2P message send")
                setMessageToSend(event)
                console.log(event)
                break;
            default:
                console.log("Unknown event");
        }
    }

    function forward_p2p_message(varPeer, message) {
        let small_connection = newPeerConnection(varPeer, message.receiver)
        setP2PConnection(small_connection)
        // small_connection.on('open', () => {
        //     console.log("SENT THE MESSAGE")
        //     small_connection.send(message)
        // })
    }

    // Listens for incoming connections
    if (peer !== null) {
        peer.on('open', (id) => {
            console.log("PEER OPENED")
            peer.on('connection', (conn) => {
                setP2PConnection(conn)
            })

            if (messageToSend !== null) {
                console.log("NOT NULL")
                forward_p2p_message(peer, messageToSend) 
            }

            // if (id == 16) {
            //     var conn = newPeerConnection(peer, '19')
            //     if (conn) {
            //         setP2PConnection(conn)
            //     }
            // }
        })
    }

    useEffect(() => {
        if(messageToSend !== null) {
            console.log("NOT NULL")
            forward_p2p_message(peer, messageToSend) 
        } 
    }, [messageToSend])

    // Listened for incoming messages
    if (p2pConnection !== null) {
        p2pConnection.on('open', () => {
            p2pConnection.on('data', (data) => {
                switch(data) {
                    case 'ping':
                        console.log("This is a ping")
                        p2pConnection.send('pong')
                        break
                    case 'pong':
                        console.log("This is a pong")
                        break;
                    default:
                        console.log("Received message: " + data)
                }
            });

            if (messageToSend !== null) {
                console.log("NOT NULL MESSAGE")
                console.log(messageToSend)
                const message = messageToSend
                p2pConnection.send(message)
            }
        })
    }

    return (
        <div>
            <button onClick={() => {sendMessage(p2pConnection, 'dummy-message')}}>Send</button>
            {props.children}
        </div>
    );
};

export default P2PMagic;
