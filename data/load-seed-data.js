const client = require('../lib/client');
// import our seed data:
const logs = require('./logs.js');
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
                      INSERT INTO users (email, hash, location)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
        [user.email, user.hash, user.location]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      wishlist.map(wishItem => {
        return client.query(`
                    INSERT INTO wishlist (englishName, isPlanet, gravity, owner_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [wishItem.englishName, wishItem.isPlanet, wishItem.gravity, user.id]);
      })
    );

    await Promise.all(
      logs.map(log => {
        return client.query(`
                    INSERT INTO logs (date, log_entry, image_url, englishName, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [log.date, log.log_entry, log.image_url, wishlist.englishName, user.id]);
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
