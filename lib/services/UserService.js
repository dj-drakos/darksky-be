const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password, 
      Number(process.env.SALT_ROUNDS)
    )
    const newUser = await User.insert({
      email, 
      passwordHash
    })
    const token = jwt.sign({ ...newUser }, `${process.env.JWT_SECRET}`, {
      expiresIn: '1 day'
    }) 
    return token 
  }

