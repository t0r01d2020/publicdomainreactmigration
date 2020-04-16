#! /bin/bash

echo "executing .global_run script..."
echo "Launches redis, then hapi-middleman, then the frontend React app..."
echo "  "
echo "Launching Redis in separate terminal..."
nohup redis-server &
echo "First, launching the middleman..."
echo "###########################################################################################"
nohup node hapi_middleman/index.js &
echo "  "
echo "  "
echo "Now, launching frontend..."
echo "############################################################################################"
react-scripts start
echo "frontend launch returend. Now, launching middleman..."
exit 0

