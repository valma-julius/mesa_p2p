FROM peerjs/peerjs-server

COPY peerjs-config.json /peerjs-config.json

CMD ["peerjs", "--port", "9000", "--path", "/forwards", "--proxied", "true", "--key", "peerjs", "--alive_timeout", "5000"]
