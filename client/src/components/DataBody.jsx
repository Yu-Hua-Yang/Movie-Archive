import AnalyticView from './AnalyticView';
import ArchiveMovies from './ArchiveMovies';
import { useEffect, useState } from 'react';

export default function DataBody(props) {
  const [averageStatistic, setAverageStatistic] = useState([]);

  useEffect(() => {
    fetch('/api/v1/movies')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      setAverageStatistic(CalculateYearlyAverage(data));
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  },[]);

  return (
    <div id='body-container'>
      {props.archiveView ? (
        // Render the ArchiveViewComponent when archiveView is true
        <ArchiveMovies 
          averageStatistic = { averageStatistic }
          filter = { props.filter }
        />
      ) : (
        // Render the AnalyticViewComponent when archiveView is false
        <AnalyticView 
          data = { averageStatistic }
        />
      )}
    </div>
  );
}

function CalculateYearlyAverage(data) {
  const yearlyAveragesArray = [];
  const yearlyDataMap = new Map();

  data.forEach((movie) => {
    const year = movie.releaseYear;

    if (!yearlyDataMap.has(year)) {
      yearlyDataMap.set(year, {
        budgetSum: 0,
        revenueSum: 0,
        runtimeSum: 0,
        profitSum: 0,
        count: 0,
      });
    }

    const yearData = yearlyDataMap.get(year);
    yearData.budgetSum += movie.budget;
    yearData.revenueSum += movie.revenue;
    yearData.runtimeSum += movie.runtime;
    yearData.profitSum += movie.profit;
    yearData.count += 1;
  });

  yearlyDataMap.forEach((yearData, year) => {
    const averageData = {
      year: Number(year),
      budgetAverage: yearData.budgetSum / yearData.count,
      revenueAverage: yearData.revenueSum / yearData.count,
      runtimeAverage: yearData.runtimeSum / yearData.count,
      profitAverage: yearData.profitSum / yearData.count,
    };
    yearlyAveragesArray.push(averageData);
  });

  return yearlyAveragesArray;
}