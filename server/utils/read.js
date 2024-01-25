const csv = require('csv-parser');
const fs = require('fs');

async function returnArrayObject(csvFilePath) {
  const movieData = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath).
      pipe(csv()).
      on('data', (row) => {
        const castArray = row.cast.split('|');
        const keywordsArray = row.keywords.split('|');
        const genresArray = row.genres.split('|');
        const productionCompaniesArray = row.production_companies.split('|');
        const profits = parseFloat(row.revenue) - parseFloat(row.budget);

        const newMovie = {
          movieID: row.id,
          imbdID: row.imdb_id ? String(row.imdb_id).trim() : null,
          popularity: parseFloat(row.popularity),
          budget: parseFloat(row.budget),
          revenue: parseFloat(row.revenue),
          title: row.original_title,
          cast: castArray,
          homePage: row.homepage,
          director: row.director,
          tagline: row.tagline,
          keywords: keywordsArray,
          overview: row.overview,
          runtime: parseInt(row.runtime),
          genres: genresArray,
          productionCompanies: productionCompaniesArray,
          releaseDate: row.release_date,
          releaseYear: parseInt(row.release_year),
          profit: profits,
        };
        movieData.push(newMovie);
      }).
      on('end', () => {
        resolve();
      }).
      on('error', (error) => {
        reject(error);
      });
  });

  return movieData;
}

module.exports = { returnArrayObject };