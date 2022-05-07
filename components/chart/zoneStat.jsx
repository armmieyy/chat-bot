import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

const StatZoneChart = ({ data }) => {
  Chart.register(ArcElement);
  const arrData = [data.zone_1, data.zone_2, data.zone_3, data.zone_4];
  return (
    <Pie
      data={{
        labels: ['ศรีวิชัย', 'นครพิงค์', 'เม็งราย', 'กาวิละ'],
        datasets: [
          {
            data: arrData,
            backgroundColor: [
              '#22C55E',
              '#ff73ec',
              '#b0237c',
              '#F97316',
              
            ],
            hoverBackgroundColor: [
              '#22C55E',
              '#ff73ec',
              '#b0237c',
              '#F97316',
            ],
          },
        ],
      }}
      width={400}
      height={600}
    ></Pie>
  );
};

export default StatZoneChart;
