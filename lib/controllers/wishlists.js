const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const Wishlist = require('../models/Wishlist')

module.exports = Router()

  .get('/', authenticate, async(req, res, next) => {
  try {
    const entries = await Wishlist.getAllByOwnerId({ userId: req.user.id })
    res.send(entries);
  } catch(error) {
    next(error)
  }
})

  .post('/', authenticate, async(req, res, next) => {
  try {
    const reqData = ({ 
      userId: req.user.id, 
      ...req.body 
    })
    const entry = await Wishlist.insert(reqData)
    res.send(entry);
  } catch(error) {
    next(error)
  }
})

  .delete('/:id', authenticate, async(req, res, next) => {
  try {
    const reqData = ({ 
      userId: req.user.id, 
      ...req.body
    })
    const message = await Wishlist.deleteById(reqData)
    res.send(message)
  } catch(error) {
      next(error)
  }
});