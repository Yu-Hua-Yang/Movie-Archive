const express = require('express');

const {
  getAllStatisticData,
  getMoviesByYear,
  getMovieById
} = require('../controllers/movie.controller');

const router = express.Router();

router.route('/').get(getAllStatisticData);
router.route('/archive/:year').get(getMoviesByYear);
router.route('/:id').get(getMovieById);

module.exports = router;