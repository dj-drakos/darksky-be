const pool = require('../utils/pool')

module.exports = class Wishlist {
  id;
  objectName;

  constructor(row) {
    this.id = row.id
    this.objectName = row.object_name
  }

  static async insert({ userId, objectName }) {
    try {
      const { rows } = await pool.query(`
      INSERT INTO wishlists (object_name, owner_id)
      VALUES ($1, $2)
      RETURNING *
      `, 
      [objectName, userId])

      return new Wishlist(rows[0])
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getAllByOwnerId({ userId }) {
    const { rows } = await pool.query(`
    SELECT * from wishlists 
    WHERE owner_id = $1
    `,
    [userId])

    if(!rows[0]) return []
    return rows.map(row => new Wishlist(row))
  }

  static async deleteById({ userId, id }) {
    try {
      await pool.query(`
      DELETE FROM wishlists 
      WHERE id = $1 AND owner_id = $2
      `, 
      [id, userId])

      return { message: 'Item successfully deleted.'}
    } catch (error) {
      throw new Error(error)
    }
  }
}