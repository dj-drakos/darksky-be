const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const Journal = require('../models/Journal')

module.exports = Router()

//post route for journals table
  .post('/', authenticate, async(req, res, next) => {
  try {
    const reqData = {
      userId: req.user.id, 
      ...req.body
    }
    const entry = await Journal.insert(reqData)
    res.send(entry);
  } catch(error) {
    next(error)
  }
})

//get route for journals table
  .get('/', authenticate, async(req, res, next) => {
  try {
    const data = await pool.query('SELECT * from journals WHERE owner_id = $1', [req.userId]);
    res.json(data.rows);
  } catch(error) {
    next(error)
  }
})

// //get route for a single journal
// app.get('/api/journals/:id', async(req, res) => {
//   try {
//     const data = await client.query(`
//     SELECT  *
//     FROM journals
//     WHERE journals.id = $1 AND journals.owner_id = $2`, [req.params.id, req.userId]);
    
//     res.json(data.rows);
//   } catch(e) {
    
//     res.status(500).json({ error: e.message });
//   }
// });

// //put route to update a single journal
// app.put('/api/journals/:id', async(req, res) => {
//   try {
//     const data = await client.query(`
//     UPDATE journals 
//     SET
//     englishname = $1, 
//     journal_entry = $2,
//     date = $3,
//     image_url = $4
//     WHERE journals.id = $5 AND journals.owner_id = $6
//     RETURNING *
//     `, [req.body.englishname, req.body.journal_entry, req.body.date, req.body.image_url, req.params.id, req.userId]);
    
//     res.json(data.rows);
//   } catch(e) {
    
//     res.status(500).json({ error: e.message });
//   }
// });

// //delete route for a single journal
// app.delete('/api/journals/:id', async(req, res) => {
//   try {
//     const data = await client.query(`DELETE FROM journals  WHERE id = $1 AND owner_id = $2
//     `, [req.params.id, req.userId]);
//     res.json(data.rows);
//   } catch(e) {
//     res.status(500).json({ error: e.message });
//   }
// });