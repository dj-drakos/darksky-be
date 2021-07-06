const client = require('../lib/client');
// import our seed data:
const journals = require('./journals.js');
const wishlist = require('./wishlist.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      wishlist.map(wishItem => {
        return client.query(`
                    INSERT INTO wishlist (englishname, isplanet, gravity, owner_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [wishItem.englishname, wishItem.isplanet, wishItem.gravity, user.id]);
      })
    );

    await Promise.all(
      journals.map(journal => {
        return client.query(`
                    INSERT INTO journals (date, englishname, journal_entry, image_url, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [journal.date, journal.englishname, journal.journal_entry, journal.image_url, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
