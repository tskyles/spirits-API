'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../models/users/user-model');
const basic = require('../auth/basic-auth');
// const oauth = require('../auth/oauth');
const bearer = require('../auth/bearer-auth');
const acl = require('../auth/access-control');

// auth routes
authRouter.get('/users', bearer, acl('superuser'), getUsers);
authRouter.get('/users/:username', bearer, acl('read'), getUser);
// authRouter.get('/oauth', getOauth);
authRouter.post('/signup', createUser);
authRouter.post('/signin', basic, signinUser);
authRouter.put('/users/:id', bearer, acl('update'), updateUser);

// router functions

function getUsers(req, res, next){
  User.find({})
    .then(results => {
      const data = {
        count: results.length,
        results: results,
      };
      res.status(200).json(data);
    });
}

function getUser(req, res, next){
  User.findOne({username: req.params.username})
    .then(results => {
      res.status(200).json(results);
    });
}

function updateUser(req, res, next){
  let id = req.params.id;
  User.findByIdAndUpdate(id, req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(next);
}

function createUser(req, res, next){
  let user = new User(req.body);
  user.save()
    .then(user => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
}

function signinUser(req, res, next){
  console.log(req.token);
  res.cookie('auth', req.token);
  res.send(req.token);
}

// function getOauth(req,res,next){
//   oauth.authorize(req)
//     .then( token => {
//       res.status(200).send(token);
//     })
//     .catch(next);
// }

module.exports = authRouter;