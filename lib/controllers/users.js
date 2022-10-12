const { Router } = require('express')
const UserService = require('../services/UserService')

// const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()

  .post('/signup', async (req, res, next) => {
    try {
      //send req body to user service to create new user in table + sign in
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