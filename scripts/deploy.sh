#!/bin/sh -e

# Clear the built output
rm -rf ./dist

# Add the version
node -e "var package = require('./package.json'); \
    var fs = require('fs');
    fs.writeFileSync('./src/version.ts', 'export const version = \"' + package.version + '\"')
"

# Compile new files
npm run compile

# Make sure the ./npm directory is empty
rm -rf ./npm
mkdir ./npm

# Copy all files from ./dist to /npm
cp -r ./dist/* ./npm/

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
node -e "var package = require('./package.json'); \
  delete package.babel; \
  delete package.scripts; \
  delete package.options; \
  package.main = 'index.js'; \
  package.module = 'index.js'; \
  package['jsnext:main'] = 'index.js'; \
  package.typings = 'index.d.ts'; \
  var origVersion = 'local';
  var fs = require('fs'); \
  fs.writeFileSync('./npm/version.js', 'exports.version = \"' + package.version + '\"'); \
  fs.writeFileSync('./npm/package.json', JSON.stringify(package, null, 2)); \
  fs.writeFileSync('./src/version.ts', 'export const version = \'' + origVersion + '\';');
  "

# Copy few more files to ./npm
cp README.md npm/
cp LICENSE.md npm/

echo 'Deploying to npm... 🚀'
cd npm && npm publish && git push --tags