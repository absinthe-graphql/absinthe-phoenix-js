#!/bin/sh -e

echo 'Deploying to npm... 🚀'
cd pkg/dist && npm publish && git push --tags