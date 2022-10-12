const pool = require('../utils/pool')

module.exports = class Wishlist {
  id;
  name;

  constructor(row) {
    this.id = row.id
    this.name = row.object_name
  }

  static async insert({ userId, name }) {
    const { rows } = await pool.query(`
    INSERT INTO wishlists (object_name, owner_id)
    VALUES ($1, $2)
    RETURNING *
    `, 
    [name, userId]
    )

    return new Wishlist(rows[0])
  }

  static async getAllByOwnerId({ userId }) {
      const { rows } = await pool.query(`
      SELECT * from wishlists 
      WHERE owner_id = $1
      `,
      [userId])
      return rows.map(row => new Wishlist(row))
  }
}