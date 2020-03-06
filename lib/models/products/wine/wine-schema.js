'use strict';

const mongoose = require('mongoose');

const wineSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  region: {type: String, required: true},
  winery: {type: String, required: true},
  year: {type: String, required: true},
  alcoholPercent: {type: Number, required: true},
});

module.exports = mongoose.model('wine', wineSchema);