import Movie from './Movie';
import React, { useState, useEffect, useRef } from 'react';
import defaultImage from '../media/noPoster.png';

function FilterMovies(movies, filter) {
  const filteredMovies = movies
    .filter((item) => item.title && item.title.toLowerCase().startsWith(filter.toLowerCase()));
  return filteredMovies;
}

export default function ArchiveMovies(props){
// set up onclick
// set up back button
  const [data, setData] = useState([]);
  const [year, setYear] = useState(2015);
  const [filter, setFilter] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieCast, setSelectedMovieCast] = useState(null);
  const [selectedMovieGenres, setSelectedMovieGenres] = useState(null);
  const [selectedMovieDirectors, setSelectedMovieDirectors] = useState(null);
  const [selectMoviePicture, setSelectedMoviePicture] = useState(null);
  const numberFieldRef = useRef(null);
  
  const fetchPosterData = async (imdbID) => {
    const apiUrl = `http://www.omdbapi.com/?i=${imdbID}&apikey=b77ecbd3`;
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();

      if (data.Poster && data.Poster !== 'N/A') {
        // Poster URL is available
        const posterUrl = data.Poster;

        // Fetch the poster image
        const posterResponse = await fetch(posterUrl);
        if (posterResponse.ok) {
          const posterBlob = await posterResponse.blob();
          const posterBlobUrl = URL.createObjectURL(posterBlob);
          return posterBlobUrl;
        }
      }
    }
    return null; // Return null if there's an error or no poster
  };

  useEffect( () => {
    (async function (){
      try{
        const movie = await fetch('/api/v1/movies/archive/' + year);
        if (!movie.ok){
          throw new Error(`Request failed, Status:  + ${movie.status}`)
        }
        const movieJson = await movie.json();
        // Fetch poster data for each movie
        const movieDataWithPosters = await Promise.all(
          movieJson.map(async (movie) => {
            const posterUrl = await fetchPosterData(movie.imbdID);
            return { ...movie, posterUrl };
          })
        );
        const finalMovieData = FilterMovies(movieDataWithPosters, filter);
        setData(finalMovieData); 
      } catch (err){
        console.error('Error fetching data:', err);
      }
    })()
  }, [year, filter]);

  function setNewYear(){
    if (numberFieldRef.current) {
      setYear(numberFieldRef.current.value);
    }

  }
  return (
    <div>
      {selectedMovie === null ? (
        <>
          <h1 id='archive-view'>Movie Archive</h1>

          <div id='filter-container'>
            <input 
              onChange={(e) => setFilter(e.target.value)} 
              type={'search'} 
              name="search" 
              id="search" 
              placeholder="Search"
            />
            <div id='year-filter'>
              <label htmlFor="id">Select 1960 to 2015:</label>
              <div id='year-input'>
                <input ref={numberFieldRef} type="number" id="id" name="id" min="1960" max="2015" />
                <button onClick={setNewYear}>Change Year</button>
              </div>
            </div>
          </div>
          <div className="row-container">
            {data.map((movie) => (
              <div 
                key={movie.movieID} 
                className="row-item"
              >
                <h1 className='movie-title'
                    onClick={() => {
                      setSelectedMovie(movie.movieID) 
                      setSelectedMoviePicture(movie.posterUrl)
                      setSelectedMovieCast(movie.cast)
                      setSelectedMovieGenres(movie.genres)
                      setSelectedMovieDirectors(movie.director)
                    }} >{movie.title}</h1>
                {movie.posterUrl ? (
                    <>
                    <div className='movie-image-container'>
                        <img className='movie-image' src={movie.posterUrl} alt={movie.title} />
                      </div>
                    </> 
                  ):(
                    <>
                      <div className='movie-image-container'>
                        <img id='default-image' src={defaultImage} alt='no movie poster' />
                      </div>
                    </>
                  )}
              </div>
            ))}
            </div>
          </>
          ) : (
          <div id='single-view'>
            <Movie 
            averageStatistic = {props.averageStatistic} 
            id={ selectedMovie } 
            url={ selectMoviePicture }
            cast={ selectedMovieCast }
            genres={ selectedMovieGenres }
            director={ selectedMovieDirectors }
            onClick={ () => { setSelectedMovie(null) }}
            />
          </div>
      )}
      </div>
  );
}