#!/bin/bash
cd /home/kavia/workspace/code-generation/melodymix-32531-e0c197fb/melodymix
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

