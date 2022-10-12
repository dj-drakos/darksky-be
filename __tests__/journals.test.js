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

describe('app routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => pool.end())

  it('returns a \"401: Unauthorized\" error if a session token is not provided in the request header', async () => {
    const { body } = await request(app)
    .get('/api/v1/journals')

    expect(body).toEqual({ 
      status: 401,
      message: 'Unauthorized request. Please sign in to continue.'
    })
  })

  it('creates a new journal in the db and returns a JSON object of the new journal item', async () => {

    const [req, sessionToken] = await signUpAndReturnToken()
    const { body } = await req
      .post('/api/v1/journals')
      .set('Authorization', sessionToken)
      .send({
        objectName: 'Moon',
        entry: 'Magnificent desolation.',
        date: 'July 20, 1969',
        imageUrl: 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/as11-40-5944.jpg',
      })

      expect(body).toEqual({
        id: expect.any(String),
        objectName: 'Moon',
        entry: 'Magnificent desolation.',
        date: 'July 20, 1969',
        imageUrl: 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/as11-40-5944.jpg',
      })
  })
})

//     test('post to journals', async() => {

//       const expectation = [
//         {
//           id: 2,
//           journal_entry: 'This is a test jounral entry',
//           englishname: 'moon',
//           date: 'July 5, 2021',
//           image_url: 'https://placekitten.com/200/300',
//           owner_id: 2
        
//         }];
      
//       const output =
//         {
//           journal_entry: 'This is a test jounral entry',
//           englishname: 'moon',
//           date: 'July 5, 2021',
//           image_url: 'https://placekitten.com/200/300'
//         };
//       await fakeRequest(app)
//         .post('/api/journals')
//         .send(output)
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);

//       const data = await fakeRequest(app)
//         .get('/api/journals')
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);

//       expect(data.body).toEqual(expectation);
//     });

//     test('put to journals', async() => {

//       const expectation = [
//         {
//           id: 2,
//           journal_entry: 'This is a test jounral entry, but edited',
//           englishname: 'moon',
//           date: 'July 5, 2021',
//           image_url: 'https://placekitten.com/200/300',
//           owner_id: 2
        
//         }];
      
      
//       await fakeRequest(app)
//         .put('/api/journals/2')
//         .send(expectation[0])
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);

//       const data = await fakeRequest(app)
//         .get('/api/journals')
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);

//       expect(data.body).toEqual(expectation);
//     });

//     test('delete from journals', async() => {

//       await fakeRequest(app) 
//         .delete('/api/journals/2')
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);




//       const data = await fakeRequest(app)
//         .get('/api/journals')
//         .set('Authorization', token)
//         .expect('Content-Type', /json/)
//         .expect(200);

//       const deletedJournalItem =
//         {
//           id: 2,
//           journal_entry: 'This is a test jounral entry, but edited',
//           englishname: 'moon',
//           date: 'July 5, 2021',
//           image_url: 'https://placekitten.com/200/300',
//           owner_id: 2
//         };

//       expect(data.body).not.toContainEqual(deletedJournalItem);
//     });

//   });
// });
