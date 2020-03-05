'use strict';

const DataModel = require('@tskyles/mongo-model');
const mongoose = require('mongoose');

const wineSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  region: {type: String, required: true},
  vineyard: {type: String, required: true},
  year: {type: String, required: true},
});


class Wine extends DataModel {
  constructor(){
    super(wineSchema);
  }
}

module.exports = Wine;