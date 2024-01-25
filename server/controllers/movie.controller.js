const DB = require('../mongodb/connect');

const db = new DB();

const getAllStatisticData = async (req, res) => {
  try {
    await db.connect('cluster0', 'movies');
    const movies = await db.readAllStatistic();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMoviesByYear = async (req, res) => {
  try {
    const { year } = req.params;
    await db.connect('cluster0', 'movies');
    const movies = await db.findMoviesByYear(year);
    if (movies) {
      res.status(200).json(movies);
    } else {
      res.status(404).json({ message: 'Movies not found in that year' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  try{
    const { id } = req.params;
    await db.connect('cluster0', 'movies');
    const result = await db.findMovieById(id);
    if (result){
      res.status(200).json(result);
    }else{
      res.status(404).json({ 'status': 404, 'error': 'Failed to find movie' }); 
    }
  } catch (e){
    res.status(500).json({ 'status': 500, 'error': e.message });
  }
};

module.exports = {
  getAllStatisticData,
  getMoviesByYear,
  getMovieById,
};