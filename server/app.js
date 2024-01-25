require('dotenv').config();

const express = require('express');
const app = express();
const router = require('./routes/movie.routes');

app.use(express.static('../client/build'));
app.use('/api/v1/movies', router);

app.use((req, res) => {
  res.status(404).send('Not found');
});

module.exports = app;
