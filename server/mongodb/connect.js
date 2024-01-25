const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
dotenv.config();
const dbUrl = process.env.MONGODB_URI;


let instance;

class DB {
  constructor(){
    //instance is the singleton, defined in outer scope
    if (!instance){
      instance = this;
      this.client = new MongoClient(dbUrl);
      this.db = null;
      this.collection = null;
    }
    return instance;
  }

  async createIndex(collectionName, fields, options = {}) {
    try {
      if (!this.db) {
        await this.connect();
      }
      const collection = this.db.collection(collectionName);
      await collection.createIndex(fields, options);
    } catch (error) {
      console.error(`Failed to create index on ${collectionName}: ${error}`);
      throw error;
    }
  }

  async connect(dbname, collName) {
    if (instance.db){
      return;
    }
    await instance.client.connect();
    instance.db = await instance.client.db(dbname);
    // Send a ping to confirm a successful connection
    await instance.client.db(dbname).command({ ping: 1 });
    // eslint-disable-next-line no-console
    console.log('Successfully connected to MongoDB database' + dbname);
    instance.collection = await instance.db.collection(collName);
  }

  async close() {
    await instance.client.close();
    instance = null;
  }

  async open(dbname, collName) {
    try {
      await instance.connect(dbname, collName);
    } finally {
      await instance.close();
    }
  }

  async readAllStatistic() {
    return await instance.collection.find({
      $and: [
        { budget: { $ne: 0 } },
        { revenue: { $ne: 0 } }
      ]
    }).project({ 
      profit: 1, 
      runtime: 1, 
      budget: 1, 
      revenue: 1,
      releaseYear: 1
    }).toArray();
  }

  async readAll() {
    return await instance.collection.find({}).toArray();
  }

  async create(quote) {
    return await instance.collection.insertOne(quote);
  } 

  async createMany(array) {
    const result = await instance.collection.insertMany(array);
    return result.insertedCount;
  }

  async findMovieById(movieId) {
    return await instance.collection.findOne({ movieID: movieId });
  }

  async findMoviesByYear(year) {
    return await instance.collection.
      find({
        releaseYear: Number(year),
        budget: { $ne: 0 },
        revenue: { $ne: 0 }
      }).project({ 
        movieID: 1,
        imbdID: 1,
        title: 1,
        cast: 1,
        genres: 1,
        director: 1
      }).
      toArray();
  }
}

module.exports = DB;