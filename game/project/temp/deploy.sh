#!/bin/bash

# HAM DEALER Game Deployment Script
# This script helps deploy the game to Netlify

echo "=== HAM DEALER Game Deployment ==="
echo "This script will help you deploy the HAM DEALER game to Netlify"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI not found. Installing..."
    npm install netlify-cli -g
    
    if [ $? -ne 0 ]; then
        echo "Failed to install Netlify CLI. Please install it manually with: npm install netlify-cli -g"
        exit 1
    fi
fi

# Navigate to the game directory
cd ../game

# Check if user is logged in to Netlify
echo "Checking Netlify authentication..."
netlify status

# If not logged in, prompt to login
if [ $? -ne 0 ]; then
    echo "Please login to Netlify:"
    netlify login
fi

# Initialize Netlify site if not already initialized
if [ ! -f ".netlify/state.json" ]; then
    echo "Initializing Netlify site..."
    netlify init
else
    echo "Netlify site already initialized."
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "=== Deployment Successful! ==="
    echo "Your HAM DEALER game is now live."
    echo "Please check the URL provided above to access your game."
    
    # Extract the URL from Netlify output
    SITE_URL=$(netlify open --url)
    echo "Game URL: $SITE_URL"
    
    # Update README with the URL
    if [ ! -z "$SITE_URL" ]; then
        sed -i "s|https://ham-dealer.netlify.app|$SITE_URL|g" README.md
        echo "Updated README.md with the correct URL."
    fi
else
    echo "=== Deployment Failed ==="
    echo "Please check the error messages above and try again."
fi

echo "=== Deployment Process Complete ==="