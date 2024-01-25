import { Line } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';

//FIX FETCH RENDERING TIME
//ONLY SHOW CHART WHEN FULLY LOADED
export default function AnalyticView({ data }) {
  const years = data.map((entry) => entry.year);
  const budgetAverages = data.map((entry) => entry.budgetAverage);
  const revenueAverages = data.map((entry) => entry.revenueAverage);
  const runtimeAverages = data.map((entry) => entry.runtimeAverage);
  const profitAverages = data.map((entry) => entry.profitAverage);

  //MAKE 2 CHARTS SO DATA ISNT MIXED FIRST Y LABEL IS COST$ AND SECOND IS MINUTES
  const chartData1 = {
    labels: years.sort(),
    datasets: [
      {
        label: 'Budget Average',
        data: budgetAverages,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Revenue Average',
        data: revenueAverages,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Profit Average',
        data: profitAverages,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  const options1 = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Years'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Average in Dollars'
        }
      }
    }
  };

  const chartData2 = {
    labels: years.sort(),
    datasets: [
      {
        label: 'Runtime Average',
        data: runtimeAverages,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      }
    ]
  }

  const options2 = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Years'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Average Runtime in Minutes'
        }
      }
    }
  };

  return (
    <div>
      <div className='line-chart'>
        <h1>Yearly Cost Statistical Average</h1>
        <Line data={chartData1} options={options1} />
      </div>
      <div className='line-chart'>
        <h1>Yearly Runtime Statistical Average</h1>
        <Line data={chartData2} options={options2} />
      </div>
    </div>
    );
}