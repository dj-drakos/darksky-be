const pool = require('../lib/utils/pool')
const setup = require('../data/setup')
const request = require('supertest')
const app = require('../lib/app')
const UserService = require('../lib/services/UserService')
const { sign } = require('jsonwebtoken')

const mockUser = {
  email: 'neil.armstrong@nasa.com',
  password: '5432'
}
const mockMoonMission = {
    objectName: 'Moon',
    entry: 'That\'s one small step for man.',
    date: 'July 20, 1969',
    imageUrl: 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/as11-40-5944.jpg',
}

const signUpAndReturnToken = async (userData = mockUser) => {
  const req = request(app)
  const { body } = await req
    .post('/api/v1/users/signup')
    .send(userData) 
  return [req, body.sessionToken]
}

const createNewJournalEntry = async (req, sessionToken, mockEntry) => {
  const { body } = await req
    .post('/api/v1/journals')
    .set('Authorization', sessionToken)
    .send(mockEntry)
  return body
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
      .send(mockMoonMission)

      expect(body).toEqual({
        id: expect.any(String),
        ...mockMoonMission
      })
  })

  it('modifies an existing journal entry and returns a JSON object of the new journal item', async () => {
    const [req, sessionToken] = await signUpAndReturnToken()
    const originalEntry = await createNewJournalEntry(req, sessionToken, mockMoonMission)

    const modifiedMoonMission = {
      entry: 'That\'s one small step for a man.',
      ...mockMoonMission
    }

    const { body } = await req  
      .put(`/api/v1/journals/${originalEntry.id}`)
      .set('Authorization', sessionToken)
      .send(modifiedMoonMission)

    expect(body).toEqual({
      id: originalEntry.id,
      ...modifiedMoonMission
    })})

})

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
