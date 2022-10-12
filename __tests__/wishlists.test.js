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
  const { body } = await request(app)
    .post('/api/v1/users/signup')
    .send(userData) 
  return body.sessionToken
}

describe('app routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => pool.end())

  it('creates a new wishlist item', async () => {
    const sessionToken = await signUpAndReturnToken()

    const { body } = await request(app)
      .post('/api/v1/wishlists')
      .set('Authorization', sessionToken)
      .send({ name: 'Pluto' })
    
    expect(body).toEqual({"id": "1", "name": "Pluto"})
  }) 

  it('returns a list of a user\'s wishlist items', async () => {
    const sessionToken = await signUpAndReturnToken()
    await request(app)
      .post('/api/v1/wishlists')
      .set('Authorization', sessionToken)
      .send({ name: 'Pluto' })
    await request(app)
      .post('/api/v1/wishlists')
      .set('Authorization', sessionToken)
      .send({ name: 'Arcturus' })

    const { body } = await request(app)
      .get('/api/v1/wishlists')

    expect(body).toEqual([{
      name: 'Pluto'
    }, {
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



