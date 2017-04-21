/****************************************************************************
USAGE: Use this with express server only
const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 4040));

// Serve single app
require('./client').default(app);

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
****************************************************************************/

const express = require('express');
const path = require('path');

export default (app) => { // eslint-disable-line

  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

}; // eslint-disable-line
