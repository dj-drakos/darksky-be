const pool = require('../lib/utils/pool')
const setup = require('../data/setup')
const request = require('supertest')
const app = require('../lib/app')
const UserService = require('../lib/services/UserService')

const mockUser = {
  email: 'test@testing.com',
  password: 'coolcool'
}

describe('app routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => pool.end())

  it('creates a new wishlist item', async () => {
    const { sessionToken } = UserService.create(mockUser)

    const { body } = await request(app)
      .post('api/v1/wishlists/')
      .set('Authorization', sessionToken)
    
    expect(body).toEqual(Object)
    

  }) 
})




// describe('app routes', () => {
//   describe('routes', () => {

//     test('post to wishlist', async() => {

//       const expectation = [
//         {
//           id: 2,
//           englishname: 'Sun',
//           owner_id: 2
//         }
//       ];
      
//       const output =
//         {
//           englishname: 'Sun',
//           isplanet: false,
//           gravity: 3000
//         };
//       await fakeRequest(app)
//         .post('/api/wishlist')
//         .send(output)
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);
//       const data = await fakeRequest(app)
//         .get('/api/wishlist')
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);

//       expect(data.body).toEqual(expectation);
//     });

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



