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
authRouter.get('/users/:username', bearer, acl('superuser'), getUser);
authRouter.get('/myprofile/:id', bearer, acl('read'), getMyInfo);
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

function getMyInfo(req, res, next){
  User.findOne({id: req.params.id})
    .then(results => {
      const user = {
        id: results.id,
        username: results.username,
        favorites: results.favorites,
        friends: results.friends,
      };
      res.status(200).send(user);
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
      res.send({
        token: req.token,
        user: {
          id: req.user.id,
          username: req.user.username,
          favorites: req.user.favorites,
          friends: req.user.friends,
        },
      });
    })
    .catch(next);
}

function signinUser(req, res, next){
  console.log(req.token);
  res.cookie('auth', req.token);
  res.send({
    token: req.token,
    user: {
      id: req.user.id,
      username: req.user.username,
      favorites: req.user.favorites,
      friends: req.user.friends,
    },
  });
}

// function getOauth(req,res,next){
//   oauth.authorize(req)
//     .then( token => {
//       res.status(200).send(token);
//     })
//     .catch(next);
// }

module.exports = authRouter;