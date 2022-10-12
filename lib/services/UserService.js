const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = class UserService {
  static async create({ email, password }) {
    try {
      const user = await User.getByEmail(email)
      if (user) throw new Error('User already exists.')
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
      
    } catch (error) {
      
    }
  }

  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email)
      const isPasswordMatch = bcrypt.compareSync(password, user.passwordHash)
      if(!user || !isPasswordMatch )
        throw new Error('Invalid Login Credentials')
      const token = jwt.sign({ ...user }, `${process.env.JWT_SECRET}`, {
        expiresIn: '1 day'
      })
      return token
    } catch (error) {
      error.status = 401
      throw error
    }
  }
}