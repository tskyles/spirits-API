'use strict';

const express = require('express');
const router = express.Router();

const Roles = require('../models/roles/roles');
const capabilities = require('../models/roles/roles-capabilities');

router.post('/roles', (req, res, next) => {
  let roleArray = [];
  Object.keys(capabilities).map(role => {
    let rolesRecord = new Roles({type: role, capabilities: capabilities[role]});
    roleArray.push(rolesRecord.save());
  });
  res.status(200).send('roles saved');
});

module.exports = router;