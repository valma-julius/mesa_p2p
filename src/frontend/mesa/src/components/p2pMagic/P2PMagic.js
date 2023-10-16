import React, { useContext, useEffect, useState }  from "react";

// PeerJS things
import { Peer } from "peerjs";

import { UserContext } from '../../context/UserContext';

const PEERJS_HOST = "localhost";
const PEERJS_PORT = 9000;
const PEERJS_PATH = "/";

function newPeerConnection(peer, id) {
    let connection = peer.connect(id);

    if (!isConnectionPinging(connection)) {
        return null;
    }

    return connection;
}

function isConnectionPinging(connection) {
    connection.send('ping')
    console.log('Ping sent')

    connection.on('data', (data) => {
        switch(data) {
            case 'pong':
                console.log("Pong received");
                return true;
        }
    });

    return false
}


const P2PMagic = (props) => {
    const user = props.user
    let [peer, setPeer] = useState(null)
    let [peerID, setPeerID] = useState(null)
    let [p2pConnection, setP2PConnection] = useState(null)
    // let peerID = null
    // let p2pConnection = null

    useEffect(() => {
        peerID = user.id;
        setPeerID(user.id)

        let peerVar = new Peer(peerID, {
            host: PEERJS_HOST,
            port: PEERJS_PORT,
            path: PEERJS_PATH,
        });
        console.log('Peer created')
        setPeer(peerVar)

        return () => {
            peerVar.disconnect();
        };
    }, [])

    useEffect(() => {
        if (!peer) {
            return
        }

        peer.on('connection', (conn) => {
            console.log("Connection received")
            setP2PConnection(conn)
        })

        if (user.id == 16) {
            var conn = newPeerConnection(peer, '19')
            if (conn) {
                setP2PConnection(conn)
            }
        }
    }, [peer])

    if (peer) {
        peer.on('connection', (conn) => {
            console.log("Connection received")
            setP2PConnection(conn)
        })

    }

    useEffect(() => {
        if (!p2pConnection) {
            return
        }

        p2pConnection.on('open', () => {
            p2pConnection.on('data', (data) => {
                switch(data) {
                    case 'ping':
                        console.log("Ping received");
                        p2pConnection.send('pong')
                    default:
                        console.log("Received message: " + data)
                }
            })
        });

    }, [p2pConnection])


    


    return <div>{props.children}</div>;
};

export default P2PMagic;
