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

  static async insert({ objectName, entry, date, imageUrl, userId }) {
    const { rows } = await pool.query(`
    INSERT INTO journals (object_name, entry, date, image_url, owner_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [objectName, entry, date, imageUrl, userId])

    return new Journal(rows[0])
  }
}