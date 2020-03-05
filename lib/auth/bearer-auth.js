'use strict';
const User = require('../models//users/user-model');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) { next('Invalid Login: wrong header'); return;}

  let token = req.headers.authorization.split(' ').pop();

  User
    .authenticateToken(token)
    .then( validUser => {
      req.user = validUser;
      next();
    })
    .catch( err => next('Unauthorized Token'));
};