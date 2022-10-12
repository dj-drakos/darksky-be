const pool = require('../lib/utils/pool')
const setup = require('../data/setup')
const request = require('supertest')
const app = require('../lib/app')
const UserService = require('../lib/services/UserService')

const mockUser = {
  email: 'test@testing.com',
  password: 'coolcool'
}

const signUpAndReturnToken = async (userData = mockUser) => {
  const req = request(app)
  const { body } = await req
    .post('/api/v1/users/signup')
    .send(userData) 
  return [req, body.sessionToken]
}

const createNewWishlistItem = async (req, sessionToken, data) => {
  await req
  .post('/api/v1/wishlists')
  .set('Authorization', sessionToken)
  .send({ name: data })
}

describe('app routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => pool.end())

  it('creates a new wishlist item', async () => {
    const [req, sessionToken] = await signUpAndReturnToken()

    const { body } = await req
      .post('/api/v1/wishlists')
      .set('Authorization', sessionToken)
      .send({ name: 'Pluto' })
    
    expect(body).toEqual({"id": "1", "name": "Pluto"})
  }) 

  it('returns a list of a user\'s wishlist items', async () => {
    const [req, sessionToken] = await signUpAndReturnToken()
    await createNewWishlistItem(req, sessionToken, 'Pluto')
    await createNewWishlistItem(req, sessionToken, 'Arcturus')

    const { body } = await req
      .get('/api/v1/wishlists')
      .set('Authorization', sessionToken)

    expect(body).toEqual([{
      id: expect.any(String),
      name: 'Pluto'
    }, {
      id: expect.any(String),
      name: 'Arcturus'
    }])
  })

  
})


//     test('get  wishlist', async() => {

//       const expectation = [
//         {
//           id: 2,
//           englishname: 'Sun',
//           owner_id: 2
//         }
//       ];
      

//       const data = await fakeRequest(app)
//         .get('/api/wishlist')
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);

//       expect(data.body).toEqual(expectation);
//     });

//     test('delete from wishlist', async() => {

//       await fakeRequest(app) 
//         .delete('/api/wishlist/2')
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);




//       const data = await fakeRequest(app)
//         .get('/api/wishlist')
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);

//       const deletedWishItem =
//         {
//           id: 2,
//           englishname: 'Sun',
//           owner_id: 2
//         };

//       expect(data.body).not.toContainEqual(deletedWishItem);
//     });



