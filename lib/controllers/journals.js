const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const Journal = require('../models/Journal')

module.exports = Router()

  .post('/', authenticate, async(req, res, next) => {
  try {
    const reqData = {
      userId: req.user.id, 
      ...req.body
    }
    const entry = await Journal.insert(reqData)
    res.send(entry);
  } catch(error) {
    next(error)
  }
})

  .get('/', authenticate, async(req, res, next) => {
  try {
    const data = await Journal.getAllByUserId(req.user.id)
    res.send(data);
  } catch(error) {
    next(error)
  }
})

  .get('/:id', authenticate, async(req, res, next) => {
  try {
    const reqData = {
      userId: req.user.id,
      id: req.params.id
    }
    const entry = await Journal.getById(reqData)
    res.send(entry);
  } catch(error) {
    next(error)
  }
})

  .put('/:id', authenticate, async(req, res, next) => {
  try {
    const reqData = {
      userId: req.user.id,
      id: req.params.id,
      ...req.body
    }
    const entry = await Journal.updateById(reqData)
    res.send(entry);
  } catch(error) {
    next(error)
  }
})

  .delete('/:id', authenticate, async(req, res, next) => {
    try {
      const reqData = {
        userId: req.user.id,
        id: req.params.id,
      }
      const message = await Journal.deleteById(reqData)
      res.send(message);
    } catch(error) {
      next(error)
    }
  });