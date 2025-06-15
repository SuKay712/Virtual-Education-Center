#!/bin/bash
set -e
echo "Installing dependencies..."
npm ci

echo "Running npm rebuild to fix symlinks..."
npm rebuild || echo "npm rebuild failed but continuing..."

echo "Starting the app..."
npm run start:prod
