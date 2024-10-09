docker build -t riko-wabot .
docker rm -f riko-bot
docker run --name riko-bot --env-file=.env -v $(pwd)/states:/app/states  --restart unless-stopped -d riko-wabot
docker logs riko-bot -f