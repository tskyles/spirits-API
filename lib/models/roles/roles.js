'use strict';

const mongoose = require('mongoose');

const roles = new mongoose.Schema({
  type: {type: String, required:true, enum:['admin', 'editor', 'user']},
  capabilities: {type: Array, required:true},
});
/** 
 * @module roles
*/
module.exports = mongoose.model('roles',roles);