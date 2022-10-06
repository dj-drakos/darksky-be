const express = require('express');
const cors = require('cors');

const app = express();
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = createAuthRoutes();

app.use('/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.userId}`
  });
});

//get route for wishlist table
app.get('/api/wishlist', async(req, res) => {
  try {
    const data = await client.query('SELECT * from wishlist WHERE owner_id = $1', [req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//post route for wishlist table
app.post('/api/wishlist', async(req, res) => {
  try {
    const data = await client.query(`INSERT INTO wishlist (englishname, owner_id)
    VALUES ($1, $2)`, [req.body.englishname, req.userId]);
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

//delete route for wishlist table
app.delete('/api/wishlist/:id', async(req, res) => {
  try {
    const data = await client.query(`DELETE FROM wishlist WHERE id = $1 AND owner_id = $2
    `, [req.params.id, req.userId]);
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

//post route for journals table
app.post('/api/journals', async(req, res) => {
  try {
    const data = await client.query(`INSERT INTO journals (englishname, journal_entry, date, image_url, owner_id)
    VALUES ($1, $2, $3, $4, $5)`, [req.body.englishname, req.body.journal_entry, req.body.date, req.body.image_url, req.userId]);
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

//get route for journals table
app.get('/api/journals', async(req, res) => {
  try {
    const data = await client.query('SELECT * from journals WHERE owner_id = $1', [req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//get route for a single journal
app.get('/api/journals/:id', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT  *
    FROM journals
    WHERE journals.id = $1 AND journals.owner_id = $2`, [req.params.id, req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//put route to update a single journal
app.put('/api/journals/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE journals 
    SET
    englishname = $1, 
    journal_entry = $2,
    date = $3,
    image_url = $4
    WHERE journals.id = $5 AND journals.owner_id = $6
    RETURNING *
    `, [req.body.englishname, req.body.journal_entry, req.body.date, req.body.image_url, req.params.id, req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//delete route for a single journal
app.delete('/api/journals/:id', async(req, res) => {
  try {
    const data = await client.query(`DELETE FROM journals  WHERE id = $1 AND owner_id = $2
    `, [req.params.id, req.userId]);
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
