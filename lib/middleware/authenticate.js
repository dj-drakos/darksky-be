const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = function authentication(req, res, next) {
  try {
    const sessionToken = req.get('Authorization')
    const payload = jwt.verify(sessionToken, JWT_SECRET)
    req.user = payload
    next()
  } catch(error) {
    error.status = 401
    error.message = 'Unauthorized request. Please sign in to continue.'
    next(error)
  }

};
