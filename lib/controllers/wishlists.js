const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const Wishlist = require('../models/Wishlist')

module.exports = Router()

  .get('/', authenticate, async(req, res, next) => {
  try {
    const entries = await Wishlist.getAllByOwnerId({ userId: req.user.id })
    res.send(entries);
  } catch(error) {
    next(error)
  }
})

  .post('/', authenticate, async(req, res, next) => {
  try {
    const reqData = ({ 
      userId: req.user.id, 
      name: req.body.name 
    })
    const entry = await Wishlist.insert(reqData)
    res.send(entry);
  } catch(error) {
    next(error)
  }
})

// //delete route for wishlist table
// app.delete('/api/wishlist/:id', async(req, res) => {
//   try {
//     const data = await client.query(`DELETE FROM wishlist WHERE id = $1 AND owner_id = $2
//     `, [req.params.id, req.userId]);
//     res.json(data.rows);
//   } catch(e) {
//     res.status(500).json({ error: e.message });
//   }
// });