import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import httpStatus from 'http-status';
import helmet from 'helmet';
import logger from 'morgan';
import PrettyError from 'pretty-error';

import routes from './api/routes/index.route';

const debug = require('debug')('rest-api:express');

const app = express();

const port = process.env.PORT || 4000;

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// print log for promise that unhandle rejection
process.on('unhandledRejection', (e) => {
  debug('%s %0', e.message, e.stack);
});

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/api', routes);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    res.status(httpStatus.OK);
    return res.send(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>API</title>
        </head>
        <body>
          <div style="height: 100%">
            Welcome!
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  debug(pe.render(err));
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  return res.send(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>API</title>
      </head>
      <body>
        <div style="height: 100%">
          Server is busy!
        </div>
      </body>
    </html>
  `);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
/* eslint-enable no-console */
