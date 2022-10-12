const pool = require('../utils/pool')

module.exports = class Journal {
  id; 
  name;
  journalEntry; 
  date;
  imageUrl;

  constructor(row) {
    this.id = row.id
    this.name = row.object_name
    this.journalEntry = row.journal_entry
    this.date = row.date
    this.imageUrl = row.image_url
  }

  static async insert({ name, journalEntry, date, imageUrl, userId }) {
    const { rows } = await pool.query(`
    INSERT INTO journals (object_name, journal_entry, date, image_url, owner_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, journalEntry, date, imageUrl, userId])

    return new Journal(rows[0])
  }
}