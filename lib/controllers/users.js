const { Router } = require('express')
const UserService = require('../services/UserService')

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      //send req body to user service to create new user in table + sign in
      const user = await UserService.create(req.body)
      res.json(user)
    } catch (error) {
        next(error)
    }
  });

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