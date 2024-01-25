import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js'

export default function Movie(props){
  const [data, setData] = useState({});

  var averages = {}

  useEffect( () => {
    fetchMovie();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function convertRuntimeToHoursAndMinutes(runtimeInMinutes) {
    if (typeof runtimeInMinutes !== 'number' || isNaN(runtimeInMinutes)) {
      return 'Invalid input';
    }
  
    const hours = Math.floor(runtimeInMinutes / 60);
    const minutes = runtimeInMinutes % 60;
  
    const hoursString = hours > 0 ? `${hours}h` : '';
    const minutesString = minutes > 0 ? `${minutes}min` : '';
  
    return `${hoursString} ${minutesString}`.trim();
  }

  async function fetchMovie(){  
    const movie = await fetch('/api/v1/movies/' + props.id);
    const movieJson = await movie.json();
    setData(movieJson); 
  }

  (function getAveragesForCurrentYear(){
    props.averageStatistic.forEach((element) => {
      if (element.year === data.releaseYear){
        averages = element;
      }
    })
  })()

  var currentMoviePlot = {
    x: ["Budget", "Revenue", "Profit"],
    y: [data.budget, data.revenue, data.profit],
    name: data.title,
    type: "bar",
  };

  var currentMovieRuntimePlot = {
    x: ["Runtime"],
    y: [data.runtime],
    name: data.title,
    type: "bar",
  }

  var yearlyAverageRuntimePlot = {
    x: ["Runtime"],
    y: [averages.runtimeAverage],
    name: "Yearly Average",
    type: "bar",
  }

  var yearlyAveragePlot = {
    x: ["Budget", "Revenue", "Profit"],
    y: [averages.budgetAverage, averages.revenueAverage, averages.profitAverage],
    name: "Yearly Average",
    type: "bar",
  };

  return (
    <div id='single-movie'>
      <div id='movie-container'>
        <div id='movie-header'>
          <h1>{ data.title }</h1>
          <button id='back-btn' onClick={ props.onClick }>Back</button>
        </div>
        <div id='movie-info'>
          <div id='movie-left-side'>
            <div id='data-info'>
              <p id='movie-release-year'>{ data.releaseYear }</p>
              <p>{ convertRuntimeToHoursAndMinutes(data.runtime) }</p>
            </div>
            <img src={props.url} alt={data.title}/>
          </div>
          <div id='movie-right-side'>
            <div className="info-section">
              <h3 className='info-title'>Genres:</h3>
              <p>{props.genres.join(', ')}</p>
            </div>
            <hr/>
            <div className="info-section">
                <h3 className='info-title'>Overview:</h3>
                <p>{ data.overview }</p>
            </div>
            <hr/>
            <div className="info-section">
                <h3 className='info-title'>Director:</h3>
                <p>{props.director.split('|').join(', ')}</p>
            </div>
            <hr/>
            <div className="info-section">
              <h3 className='info-title'>Cast:</h3>
              <p>{props.cast.join(', ')}</p>
            </div>
            <hr/>
            <div className="info-section">
              <h3 className='info-title'>Link:</h3>
              <a id='movie-link' href={ data.homePage } target="_blank" rel="noopener noreferrer">
                  Link To Website
              </a>
            </div>
          </div>
        </div>
      </div>
      <hr/>
        <div id='statistic-info'>
          <div id='plot1'>
            <Plot
              data={[ currentMoviePlot, yearlyAveragePlot ]}
              layout={ {title: 'Movie vs Yearly Cost Average'} }
              style={{ width: '100%', height: '100%' }}/>
          </div>
          <div id='plot2'>
            <Plot
              data={[ currentMovieRuntimePlot, yearlyAverageRuntimePlot ]}
              layout={ {title: 'Movie vs Yearly Runtime Average'} }
              style={{ width: '100%', height: '100%' }}/>
          </div>
        </div>
    </div>
  );
}
