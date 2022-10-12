const pool = require('../lib/utils/pool')
const setup = require('../data/setup')
const request = require('supertest')
const app = require('../lib/app')
const UserService = require('../lib/services/UserService')

const mockUser = {
  email: 'test@testing.com',
  password: '1234'
}

describe('app routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => pool.end())

  it('creates a new user in the db and returns an object with a confirmation message and a session token', async () => {
    const { body } = await request(app)
      .post('/api/v1/users/signup')
      .send(mockUser)

      expect(body).toEqual({
        message: 'Sign up successful!',
        sessionToken: expect.any(String)
      })
  })

  it('signs in an existing user and returns an object with a confirmation message and a session token', async () => {
    await UserService.create(mockUser)

    const { body } = await request(app)
      .post('/api/v1/users/signin')
      .send(mockUser)

      expect(body).toEqual({
        message: 'Sign in successful!',
        sessionToken: expect.any(String)
      })
  })
})
