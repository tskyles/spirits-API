'use strict';

// dependancies
const express = require('express');
const router = express.Router();

// model imports
// const beer = require('../models/products/beer/beer-model');
const wine = require('../models/products/wine/wine-model');
// const spirits = require('../models/products/spirits/spirits-model');

// auth imports
const bearerAuth = require('../auth/bearer-auth');
const acl = require('../auth/access-control');

/**
 * gets model based on url input
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns model
 */
function getModel(req, res, next){
  let model = req.params.model;
  console.log(model);
  switch(model){
  case 'beer':
    req.model = beer;
    next();
    return;
  case 'wine':
    req.model = wine;
    next();
    return;
  case 'spirits':
    req.model = spirits;
    next();
    return;
  }
}

// routes
router.param('model', getModel);
router.get('/api/v1/:model', bearerAuth, acl('read'), handleGetAll);
router.post('/api/v1/:model', bearerAuth, acl('create'), handlePost);
router.get('/api/v1/:model/:id', bearerAuth, acl('read'), handleGetOne);
router.put('/api/v1/:model/:id', bearerAuth, acl('update'), handleUpdate);
router.delete('/api/v1/:model/:id', bearerAuth, acl('delete'), handleDelete);

// route handlers

/**
 * @function handleGetAll
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 */
function handleGetAll(req, res, next){
  req.model.get()
    .then(records => {
      const output = {
        count: records.count,
        results: records,
      };
      res.status(200).json(output);
    })
    .catch(next);
}

/**
 * @function handleGetOne
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 */
function handleGetOne(req, res, next){
  let id = req.params.id;
  req.model.get(id)
    .then(result => {
      res.status(200).json(result);  
    })
    .catch(next);
}

/**
 * @function handlePost
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 */
function handlePost(req, res, next){
  console.log(req.model, req.body);
  req.model.post(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(next);
}

/**
 * @function handleUpdate
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 */
function handleUpdate(req, res, next){
  let id = req.params.id;
  req.model.put(id, req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(next);
}

/**
 * @function handleDelete
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 */
function handleDelete(req, res, next){
  let id = req.params.id;
  req.model.delete(id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(next);
}

module.exports = router;