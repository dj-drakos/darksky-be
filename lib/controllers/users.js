const { Router } = require('express')
const UserService = require('../services/UserService')

module.exports = Router()

  .post('/signup', async (req, res, next) => {
    try {
      const sessionToken = await UserService.create(req.body)
      res
        .send({ message: 'Sign up successful!',
        sessionToken})
    } catch (error) {
        next(error)
    }
  })
  
  .post('/signin', async (req, res, next) => {
    try {
      const sessionToken = await UserService.signIn(req.body)
      res
        .send({ message: 'Sign in successful!',
        sessionToken})
    } catch (error) {
      next(error)
    }
  })