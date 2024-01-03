FROM peerjs/peerjs-server

COPY peerjs-config.json /peerjs-config.json

CMD ["peerjs", "--port", "9000", "--path", "/forwards", "--sslkey", "/etc/letsencrypt/live/mesa-vu.com/privkey.pem;", "--sslcert", "/etc/letsencrypt/live/mesa-vu.com/fullchain.pem;", "--proxied", "true"]
