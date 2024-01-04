# Mesa

Mesa is a P2P messenger oriented towards complete user privacy

## Nginx config

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;  # Replace with your server name or keep as catch-all
    return 301 https://$host$request_uri;
}

server {
	listen 443 ssl;
	server_name mesa-vu.com;
    	ssl_certificate /etc/letsencrypt/live/mesa-vu.com/fullchain.pem; # managed by Certbot
    	ssl_certificate_key /etc/letsencrypt/live/mesa-vu.com/privkey.pem; # managed by Certbot

	index index.html index.htm index.nginx-debian.html;

	location / {
                root /var/www/mesa_client;
                index index.html;
                try_files $uri $uri/ =404;
        }

	location /forwards {
		proxy_pass http://localhost:9000/forwards;
        	proxy_http_version 1.1;
		proxy_set_header Connection $http_connection;
           	proxy_set_header Upgrade $http_upgrade;
	}

	location /api/ {
		proxy_pass http://localhost:7777;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
        	proxy_cache_bypass $http_upgrade;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        	proxy_set_header X-Forwarded-Proto $scheme;
	}

}

map $http_upgrade $connection_upgrade {
      default upgrade;
      '' close;
}

```

## Build peerjs server

```
docker build -t my-custom-peerjs-server . 
```

## Run docker dependancies
```
docker-compose up -d
```
