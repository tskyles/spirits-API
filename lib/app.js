'use strict';

// dependancies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// imports
const modelRouter = require('../lib/routes/models-router');
const authRouter = require('../lib/routes/auth-router');
const rolesRouter = require('../lib/routes/roles-router');
const notFoundHandler = require('./middleware/404');
const errorHandler = require('./middleware/500');

// prepare express app
const app = express();

// app level middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
app.use(rolesRouter);
app.use(modelRouter);
app.use(authRouter);

// catch-alls
app.use(notFoundHandler);
app.use(errorHandler);

// server start export
module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => console.log(`server up on ${port}`));
  },
};