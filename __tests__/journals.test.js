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
const mockMoonEntry = {
    objectName: 'Moon',
    entry: 'That\'s one small step for man.',
    date: 'July 20, 1969',
    imageUrl: 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/as11-40-5944.jpg',
}

const mockHalleyEntry = {
  objectName: 'Halley\'s Comet',
  entry: 'When the comet was first seen, it appeared in the western sky, its head toward the north and tail towards the south, about horizontal and considerably above the horizon and quite a distance south of the Sun. It could be plainly seen directly after sunset every day, and was visible for a long time, perhaps a month ...',
  date: 'July 20, 1969',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Looking_at_Halley%27s_Comet%2C_1835_RMG_PT1974.tiff/lossy-page1-440px-Looking_at_Halley%27s_Comet%2C_1835_RMG_PT1974.tiff.jpg',
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
      .send(mockMoonEntry)

      expect(body).toEqual({
        id: expect.any(String),
        ...mockMoonEntry
      })
  })

  it('modifies an existing journal entry and returns a JSON object of the new journal item', async () => {
    const [req, sessionToken] = await signUpAndReturnToken()
    const originalEntry = await createNewJournalEntry(req, sessionToken, mockMoonEntry)

    const modifiedMoonEntry = {
      entry: 'That\'s one small step for a man.',
      ...mockMoonEntry
    }

    const { body } = await req  
      .put(`/api/v1/journals/${originalEntry.id}`)
      .set('Authorization', sessionToken)
      .send(modifiedMoonEntry)

    expect(body).toEqual({
      id: originalEntry.id,
      ...modifiedMoonEntry
    })})


  it('returns an authenticated user\'s journals as an aray of JSON objects', async () => {
    const [req, sessionToken] = await signUpAndReturnToken()
    const moonEntry = await createNewJournalEntry(req, sessionToken, mockMoonEntry)
    const halleyEntry = await createNewJournalEntry(req, sessionToken, mockHalleyEntry)

    const { body } = await req 
      .get('/api/v1/journals')
      .set('Authorization', sessionToken)

  expect(body).toEqual([ moonEntry, halleyEntry])
  })

  it('returns a single journal as a JSON object', async ()=> {
    const [req, sessionToken] = await signUpAndReturnToken()
    const halleyEntry = await createNewJournalEntry(req, sessionToken, mockHalleyEntry)

    const { body } = await req
      .get(`api/v1/journals/${halleyEntry.id}`)
      .set('Authorization', sessionToken)

    expect(body).toEqual(halleyEntry)
  })
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
