const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('./jwt');
const ensureAuth = require('./ensure-auth');

function getProfileWithToken(user) {
  // eslint-disable-next-line no-unused-vars
  const { hash, ...rest } = user;
  return {
    ...rest,
    token: jwt.sign({ id: user.id })
  };
}

const defaultQueries = {
  selectUser(email) {
    return client.query(`
      SELECT id, email, hash
      FROM users
      WHERE email = $1;
  `,
    [email]
    ).then(result => result.rows[0]);
  },
  insertUser(user, hash) {
    return client.query(`
      INSERT into users (email, hash)
      VALUES ($1, $2)
      RETURNING id, email;
  `,
    [user.email, hash]
    ).then(result => result.rows[0]);
  }
};

module.exports = function createAuthRoutes(queries = defaultQueries) {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  router.get('/verify', ensureAuth, (req, res) => {
    res.json({ verified: true });
  });

  router.post('/signup', (req, res) => {
    try {
      const { password, ...user } = req.body;
      const email = user.email;
  
      // email and password needs to exist
      if(!email || !password) {
        const error = new Error('email and password required')
        error.status = 400
        throw error
      }
  
      // email needs to not exist already
      queries.selectUser(email)
        .then(foundUser => {
          if(foundUser) {
            const error = new Error('email already exists')
            error.status = 400
            throw error
          }
  
          // insert into profile the new user
          queries.insertUser(user, bcrypt.hashSync(password, 8))
            .then(user => {
              res.json(getProfileWithToken(user));
            });
        });
      
    } catch ({message, status}) {
        res.json({error: {message, status}})
    }
  });

  router.post('/signin', (req, res) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    // email and password needs to exist
    if(!email || !password) {
      res.status(400).json({ error: 'email and password required' });
      return;
    }

    queries.selectUser(email)
      .then(user => {
        // does email match one in db?
        // #1 !user - if no user, then no match on a row for email
        // #2 !compareSync - provided password did not match hash from db
        if(!user || !bcrypt.compareSync(password, user.hash)) {
          res.status(400).json({ error: 'email or password incorrect' });
          return;
        }

        res.json(getProfileWithToken(user));
      });
  });

  return router;
};
