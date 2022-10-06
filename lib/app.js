const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/v1/journals', require('./controllers/journals'))
app.use('/api/v1/users', require('./controllers/users'))
app.use('/api/v1/wishlists', require('./controllers/wishlists'))

app.use(require('./middleware/not-found'))
app.use(require('./middleware/error'))

module.exports = app;
