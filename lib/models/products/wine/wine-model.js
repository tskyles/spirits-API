'use strict';

const DataModel = require('@tskyles/mongo-model');
const wineSchema = require('./wine-schema');

class Wine extends DataModel {
  constructor(){
    super(wineSchema);
  }
}

// {
//   "name": "Simple Pleasures",
//   "type": "Cabernet Sauvignon",
//   "region": "Columbia Valley, WA",
//   "vineyard": "Naked Winery",
//   "year": "2017",
//   "alcoholPercent": 13.9
// }

module.exports = new Wine;