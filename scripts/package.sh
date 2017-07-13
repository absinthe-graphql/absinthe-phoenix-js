#!/bin/sh -e

# Add the version
node -e "var package = require('./package.json'); \
    var fs = require('fs');
    fs.writeFileSync('./src/version.ts', 'export const version = \"' + package.version + '\"')
"

# Compile new files
npm run compile
# Create bundle
npm run bundle
# Compile for browser
npm run compile:browser
# Minify for browser
npm run minify:browser

# Copy all files from ./pkg/lib to ./pkg/dist
cp -r ./pkg/lib ./pkg/dist/

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
node -e "var package = require('./package.json'); \
  delete package.babel; \
  delete package.scripts; \
  delete package.options; \
  delete package.files; \
  delete package.devDependencies; \
  package.main = 'absinthe-phoenix.umd.js'; \
  package.module = 'index.js'; \
  package['jsnext:main'] = 'index.js'; \
  package.browser = './browser/index.js'; \
  package.typings = 'index.d.ts'; \
  var origVersion = 'local';
  var fs = require('fs'); \
  fs.writeFileSync('./pkg/dist/version.js', 'exports.version = \"' + package.version + '\"'); \
  fs.writeFileSync('./pkg/dist/package.json', JSON.stringify(package, null, 2)); \
  fs.writeFileSync('./src/version.ts', 'export const version = \'' + origVersion + '\';');
  "

# Copy few more files to ./npm
cp README.md ./pkg/dist
cp LICENSE.md ./pkg/dist