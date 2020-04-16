#! /bin/bash

echo "executing .global_run script..."

echo "First, launching the middleman..."
echo "###########################################################################################"
node hapi_middleman/index.js
echo "  "
echo "  "
echo "Now, launching frontend..."
echo "############################################################################################"
react-scripts start
echo "frontend launch returend. Now, launching middleman..."
exit 0

