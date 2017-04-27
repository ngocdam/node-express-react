# How to build AltaWallet core

Almost library run on NodeJS, so we need convert to pure Javascript what can run on browser.

Convert to pure JS: https://www.npmjs.com/package/browsify.<br>
Compress: https://www.npmjs.com/package/uglify-js.

I configured for conversion and compression(only compress, does not mangle) in package.json. Let run below command:
*(Remember change directory to: lib/altawallet-core)*
<pre>
npm install : download dependencies
npm run build-js : convert and compress, output is AltaWallet.min.js
npm run build-dev : convert only, output is AltaWallet.js
</pre>

