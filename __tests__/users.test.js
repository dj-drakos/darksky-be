const pool = require('../lib/utils/pool')
const setup = require('../data/setup')
const request = require('supertest')
const app = require('../lib/app')
const UserService = require('../lib/services/UserService')

const mockUser = {
  email: 'test@testing.com',
  password: 'cool'
}

describe('app routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => pool.end())

  it('creates a new user', async () => {
    const { body } = await request(app)
      .post('/api/v1/users/signup')
      .send(mockUser)

      expect(body).toEqual({
        message: 'Sign up successful!',
        sessionToken: expect.any(String)
      })
  })

  it('signs in an existing user', async () => {
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
