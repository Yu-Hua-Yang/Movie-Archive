/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app.js');
const DB = require('../mongodb/connect.js');
const { returnArrayObject } = require('../utils/read.js');
const path = require('path');
const filePath = path.join(__dirname, 'testDataset.csv');

jest.mock('../mongodb/connect.js');

describe('Movie Controller Routes', () => {
  describe('GET /api/v1/movies', () => {
    test('should return a list of movies with statistics', async () => {
      const expectedMovies = [
        {'_id':'654048d2447d3423d9f7984c', 'budget':150000000, 'revenue':1513528810,
          'runtime':124, 'releaseYear':2015, 'profit':1363528810},
        {'_id':'654048d2447d3423d9f7984d', 'budget':150000000, 'revenue':378436354,
          'runtime':120, 'releaseYear':2015, 'profit':228436354}
      ];

      jest.spyOn(DB.prototype, 'readAllStatistic').mockResolvedValue(expectedMovies);

      const response = await request(app).get('/api/v1/movies');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedMovies);
    });
  });

  describe('GET /api/v1/movies/archive/:year', () => {
    test('should return movies from a specific year', async () => {
      const expectedMovies = [
        { title: 'Movie 1', releaseYear: 2022 },
        { title: 'Movie 2', releaseYear: 2022 },
      ];

      jest.spyOn(DB.prototype, 'findMoviesByYear').mockResolvedValue(expectedMovies);

      const response = await request(app).get('/api/v1/movies/archive/2022');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedMovies);
    });
  });

  describe('GET /api/v1/movies/:id', () => {
    test('should return movie info by ID', async () => {
      const expectedMovie = {
        title: 'Movie 1',
        movieID: '123',
      };
      jest.spyOn(DB.prototype, 'findMovieById').mockResolvedValue(expectedMovie);
      const response = await request(app).get('/api/v1/movies/123');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedMovie);
    });
  });

});

describe('Loading Seed Module', () => {
  test('checking data loading', async () => {
    const movieData = await returnArrayObject(filePath);
    const expectedResult = [{
      'movieID':'135397',
      'imbdID':'tt0369610',
      'popularity':32.985763,
      'budget':150000000,
      'revenue':1513528810,
      'title':'Jurassic World',
      'cast':[
        'Chris Pratt',
        'Bryce Dallas Howard',
        'Irrfan Khan',
        'Vincent D\'Onofrio',
        'Nick Robinson'
      ],
      'homePage':'http://www.jurassicworld.com/',
      'director':'Colin Trevorrow',
      'tagline':'The park is open.',
      'keywords':[
        'monster',
        'dna',
        'tyrannosaurus rex',
        'velociraptor',
        'island'
      ],
      // eslint-disable-next-line max-len
      'overview':'Twenty-two years after the events of Jurassic Park, Isla Nublar now features a fully functioning dinosaur theme park, Jurassic World, as originally envisioned by John Hammond.',
      'runtime':124,
      'genres':[
        'Action',
        'Adventure',
        'Science Fiction',
        'Thriller'
      ],
      'productionCompanies':[
        'Universal Studios',
        'Amblin Entertainment',
        'Legendary Pictures',
        'Fuji Television Network',
        'Dentsu'
      ],
      'releaseDate': '6/9/2015',
      'releaseYear':2015,
      'profit':1363528810
    }];
    expect(movieData).toEqual(expectedResult);
  });
});