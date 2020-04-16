#! /bin/bash

echo "executing .global_run script..."
echo "Launches redis, then hapi-middleman, then the frontend React app..."
echo "  "
echo "Launching Redis in separate process..."
redis-server /usr/local/etc/redis.conf &

echo "Redis server launched..."
echo "   "

echo "First, launching the middleman in a separate process...and a separate Shell Tab..."
echo "###########################################################################################"
ttab node ./hapi_middleman/index.js &
echo "  "
echo "  "
echo "Now, launching frontend..."
echo "############################################################################################"
react-scripts start
echo "frontend launch returend. Now, launching middleman..."
exit 0

