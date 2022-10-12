const pool = require('../utils/pool')

module.exports = class Journal {
  id; 
  objectName;
  entry; 
  date;
  imageUrl;

  constructor(row) {
    this.id = row.id
    this.objectName = row.object_name
    this.entry = row.entry
    this.date = row.date
    this.imageUrl = row.image_url
  }


  static async getAllByUserId(userId) {
    const { rows } = await pool.query(`
    SELECT * from journals 
    WHERE owner_id = $1
    `,
    [userId])

    return rows.map(row => new Journal(row))
  }

  static async getById({ userId, id }) {
    const { rows } = await pool.query(`
    SELECT  *
    FROM journals
    WHERE journals.id = $1 AND journals.owner_id = $2
    `, 
    [id, userId])

    if(!rows) return null
    return new Journal(rows[0])
  }

  static async insert({ objectName, entry, date, imageUrl, userId }) {
    const { rows } = await pool.query(`
    INSERT INTO journals (object_name, entry, date, image_url, owner_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [objectName, entry, date, imageUrl, userId])

    return new Journal(rows[0])
  }

  static async update({ objectName, entry, date, imageUrl, userId, id }) {
    const { rows } = await pool.query(`
    UPDATE journals 
    SET
    object_name = $1, 
    entry = $2,
    date = $3,
    image_url = $4
    WHERE journals.id = $5 AND journals.owner_id = $6
    RETURNING *
    `, [objectName, entry, date, imageUrl, id, userId]);
    
    return new Journal(rows[0])
  }
}