'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const capabilities = require('../roles/roles-capabilities');

let usedTokens = new Set();

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required: true},
  email: {type: String},
  role: {type: String, default: 'user', enum: ['admin', 'editor', 'user']},
}, {toObject: {virtuals: true}, toJSON: {virtuals: true}});

users.virtual('userRole', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'type',
  justOne: false,
});

users.pre('findOne', async function(){
  try{
    this.populate('userRole');
  }
  catch(error){
    console.error('find user error', error);
  }
});

users.pre('save', async function(){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
});


users.statics.createFromOAuth = function(oauthUser) {
  console.log('user', oauthUser);

  if(!oauthUser) { return Promise.reject('Validation Error'); }

  return this.findOne( {email: `${oauthUser.email}`} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch( error => {
      console.log('Creating new user');
      let username = oauthUser.email;
      let password = 'none';
      let email = oauthUser.email;
      return this.create({username, password, email});
    });
};

users.statics.authenticateToken = function(token){
  if((process.env.SINGLE_USE_TOKENS === 'true') && usedTokens.has(token)){
    return Promise.reject('invalid token');
  }

  let parsedToken = jwt.verify(token, process.env.SECRET);
  usedTokens.add(token);

  let query = {_id: parsedToken.id};
  return this.findOne(query)
    .catch( error => {throw error;});
};

users.statics.authenticateBasic = function(auth){
  let query = { username: auth.username };
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password))
    .catch( error => {throw error;});
};

users.methods.comparePassword = function(password){
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

users.methods.generateToken = function(){
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    role: this.role,
  };

  return jwt.sign(token, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRES});
};

module.exports = mongoose.model('user', users);