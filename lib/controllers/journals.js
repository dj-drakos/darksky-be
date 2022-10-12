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
    const data = await Journal.getAllByUserId(req.user.id)
    res.send(data);
  } catch(error) {
    next(error)
  }
})

//get route for a single journal
  .get('/:id', authenticate, async(req, res, next) => {
  try {
    const reqData = {
      userId: req.user.id,
      id: req.params.id
    }
    const entry = await Journal.getById(reqData)
    res.send(entry);
  } catch(error) {
    next(error)
  }
})

//put route to update a single journal
  .put('/:id', authenticate, async(req, res, next) => {
  try {
    const reqData = {
      userId: req.user.id,
      id: req.params.id,
      ...req.body
    }
    const entry = await Journal.update(reqData)
    res.send(entry);
  } catch(error) {
    next(error)
  }
})

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