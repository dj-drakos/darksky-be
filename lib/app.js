const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

app.use('/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/api/wishlist', async(req, res) => {
  try {
    const data = await client.query('SELECT * from wishlist WHERE owner_id = $1', [req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/wishlist', async(req, res) => {
  try {
    console.log(req.body);
    const data = await client.query(`INSERT INTO wishlist (englishname, isplanet, gravity, owner_id)
    VALUES ($1, $2, $3, $4)`, [req.body.englishname, req.body.isplanet, req.body.gravity, req.userId]);
    res.json(data.rows);
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;
