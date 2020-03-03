'use strict';

// dependancies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// imports
import modelRouter from '../lib/routes/models-router';

// prepare express app
const app = express();

// app level middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
app.use(modelRouter);

// catch-alls

// server start export
module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => console.log(`server up on ${port}`));
  },
};