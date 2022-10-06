const { Router } = require('express')

module.exports = Router()

// //get route for wishlist table
// app.get('/api/wishlist', async(req, res) => {
//   try {
//     const data = await client.query('SELECT * from wishlist WHERE owner_id = $1', [req.userId]);
    
//     res.json(data.rows);
//   } catch(e) {
    
//     res.status(500).json({ error: e.message });
//   }
// });

// //post route for wishlist table
// app.post('/api/wishlist', async(req, res) => {
//   try {
//     const data = await client.query(`INSERT INTO wishlist (englishname, owner_id)
//     VALUES ($1, $2)`, [req.body.englishname, req.userId]);
//     res.json(data.rows);
//   } catch(e) {
//     res.status(500).json({ error: e.message });
//   }
// });

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