require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('post to wishlist', async() => {

      const expectation = [
        {
          id: 2,
          englishname: 'Sun',
          owner_id: 2
        }
      ];
      
      const output =
        {
          englishname: 'Sun',
          isplanet: false,
          gravity: 3000
        };
      await fakeRequest(app)
        .post('/api/wishlist')
        .send(output)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      const data = await fakeRequest(app)
        .get('/api/wishlist')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('get  wishlist', async() => {

      const expectation = [
        {
          id: 2,
          englishname: 'Sun',
          owner_id: 2
        }
      ];
      

      const data = await fakeRequest(app)
        .get('/api/wishlist')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('delete from wishlist', async() => {

      await fakeRequest(app) 
        .delete('/api/wishlist/2')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);




      const data = await fakeRequest(app)
        .get('/api/wishlist')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      const deletedWishItem =
        {
          id: 2,
          englishname: 'Sun',
          owner_id: 2
        };

      expect(data.body).not.toContainEqual(deletedWishItem);
    });

    test('post to journals', async() => {

      const expectation = [
        {
          id: 2,
          journal_entry: 'This is a test jounral entry',
          englishname: 'moon',
          date: 'July 5, 2021',
          image_url: 'https://placekitten.com/200/300',
          owner_id: 2
        
        }];
      
      const output =
        {
          journal_entry: 'This is a test jounral entry',
          englishname: 'moon',
          date: 'July 5, 2021',
          image_url: 'https://placekitten.com/200/300'
        };
      await fakeRequest(app)
        .post('/api/journals')
        .send(output)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      const data = await fakeRequest(app)
        .get('/api/journals')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('put to journals', async() => {

      const expectation = [
        {
          id: 2,
          journal_entry: 'This is a test jounral entry, but edited',
          englishname: 'moon',
          date: 'July 5, 2021',
          image_url: 'https://placekitten.com/200/300',
          owner_id: 2
        
        }];
      
      
      await fakeRequest(app)
        .put('/api/journals/2')
        .send(expectation[0])
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      const data = await fakeRequest(app)
        .get('/api/journals')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('delete from journals', async() => {

      await fakeRequest(app) 
        .delete('/api/journals/2')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);




      const data = await fakeRequest(app)
        .get('/api/journals')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      const deletedJournalItem =
        {
          id: 2,
          journal_entry: 'This is a test jounral entry, but edited',
          englishname: 'moon',
          date: 'July 5, 2021',
          image_url: 'https://placekitten.com/200/300',
          owner_id: 2
        };

      expect(data.body).not.toContainEqual(deletedJournalItem);
    });

  });
});
