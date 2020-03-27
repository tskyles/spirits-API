'use strict';

const mongoose = require('mongoose');

const wineSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  region: {type: String, required: true},
  winery: {type: String, required: true},
  year: {type: String, required: true},
  userRatings: {type: Map, of: Number, default: {}},
});

module.exports = mongoose.model('wine', wineSchema);