const pool = require('../lib/utils/pool')
const setup = require('../data/setup')
const request = require('supertest')
const app = require('../lib/app')
const UserService = require('../lib/services/UserService')

const mockUser = {
  email: 'test@testing.com',
  password: '1234'
}

const signUpAndReturnToken = async (userData = mockUser) => {
  const req = request(app)
  const { body } = await req
    .post('/api/v1/users/signup')
    .send(userData) 
  return [req, body.sessionToken]
}

const createNewWishlistItem = async (req, sessionToken, objectName) => {
  const { body } = await req
    .post('/api/v1/wishlists')
    .set('Authorization', sessionToken)
    .send({ objectName })
  return body
}

describe('app routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => pool.end())

  it('returns a \"401: Unauthorized\" error if a session token is not provided in the request header', async () => {
    const { body } = await request(app)
    .get('/api/v1/wishlists')

    expect(body).toEqual({ 
      status: 401,
      message: 'Unauthorized request. Please sign in to continue.'
    })
  })

  it('posts a new wishlist item to the db then returns a JSON object of the new db item', async () => {
    const [req, sessionToken] = await signUpAndReturnToken()

    const { body } = await req
      .post('/api/v1/wishlists')
      .set('Authorization', sessionToken)
      .send({ objectName: 'Pluto' })
    
    expect(body).toEqual({"id": "1", "objectName": "Pluto"})
  }) 

  it('returns an authenticated user\'s wishlist as an array of JSON objects', async () => {
    const [req, sessionToken] = await signUpAndReturnToken()
    await createNewWishlistItem(req, sessionToken, 'Pluto')
    await createNewWishlistItem(req, sessionToken, 'Arcturus')

    const { body } = await req
      .get('/api/v1/wishlists')
      .set('Authorization', sessionToken)

    expect(body).toEqual([{
      id: expect.any(String),
      objectName: 'Pluto'
    }, {
      id: expect.any(String),
      objectName: 'Arcturus'
    }])
  })

  it('deletes an authenticated user\'s wishlist item and returns a confirmation message', async () => {
    const [req, sessionToken] = await signUpAndReturnToken()
    const pluto = await createNewWishlistItem(req, sessionToken, 'Pluto')

    const { body } = await req
      .delete(`/api/v1/wishlists/${pluto.id}`)
      .set('Authorization', sessionToken)
      
    expect(body).toEqual({ message: 'Item successfully deleted.'})
  })
})

