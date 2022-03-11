import "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

const data = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
  ],
};

const StatChart = ({ data }) => {
  Chart.register(ArcElement);
  const arrData = [data.Good, data.Pollen, data.Mite, data.Enemy, data.Queen];
  return (
    <Pie
      data={{
        labels: ["Good", "Pollen", "Mite", "Enemy", "Queen"],
        datasets: [
          {
            data: arrData,
            backgroundColor: [
              "#22C55E",
              "#F97316",
              "#F59E0B",
              "#EF4444",
              "#06B6D4",
            ],
            hoverBackgroundColor: [
              "#22C55E",
              "#F97316",
              "#F59E0B",
              "#EF4444",
              "#06B6D4",
            ],
          },
        ],
      }}
      width={400}
      height={600}
    ></Pie>
  );
};

export default StatChart;
