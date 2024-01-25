const DB = require('../mongodb/connect.js');
const { returnArrayObject } = require('./read.js');
const path = require('path');
const filePath = path.join(__dirname, 'movieDataset.csv');
const db = new DB();

const occupyDB = async () => {
  const movieDocuments = await returnArrayObject(filePath);

  try {
    const db = new DB();
    await db.connect('cluster0', 'movies');
    const num = await db.createMany(movieDocuments);
    // eslint-disable-next-line no-console
    console.log(`Inserted ${num} movies`);
    await db.createIndex('movies', { 
      movieID: 1, 
      releaseYear: 1, 
      profit: 1, 
      runtime: 1, 
      budget: 1, 
      revenue: 1 
    });
  } catch (e) {
    console.error('could not seed');
    // eslint-disable-next-line no-console
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
};

occupyDB();