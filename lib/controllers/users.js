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
  

  // router.post('/signin', (req, res) => {
  //   const body = req.body;
  //   const email = body.email;
  //   const password = body.password;

  //   // email and password needs to exist
  //   if(!email || !password) {
  //     res.status(400).json({ error: 'email and password required' });
  //     return;
  //   }

  //   queries.selectUser(email)
  //     .then(user => {
  //       // does email match one in db?
  //       // #1 !user - if no user, then no match on a row for email
  //       // #2 !compareSync - provided password did not match hash from db
  //       if(!user || !bcrypt.compareSync(password, user.hash)) {
  //         res.status(400).json({ error: 'email or password incorrect' });
  //         return;
  //       }

  //       res.json(getProfileWithToken(user));
  //     });
  // });