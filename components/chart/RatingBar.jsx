import React from 'react';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

export default function RatingBar({ data }) {
  console.log(data);

  Chart.register(ArcElement);
  const arrData = [data.five, data.four, data.three, data.two, data.one];

  return (
    <Bar
      data={{
        labels: ['5', '4', '3', '2', '1'],
        datasets: [
          {
            label: "คะแนน",
            data: arrData,
            backgroundColor: [
              '#FF0000',
              '#FF9900',
              '#FF3399',
              '#FF66FF',
              '#FFCCFF',
            ],
            hoverBackgroundColor: [
              '#FF0000',
              '#FF9900',
              '#FF3399',
              '#FF66FF',
              '#FFCCFF',
            ],
          },
        ],
      }}
      options={{ indexAxis: 'y' }}
    ></Bar>
  );
}
