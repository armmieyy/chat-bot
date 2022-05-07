import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

const StatKindChart = ({ data }) => {
  Chart.register(ArcElement);
  const arrData = [
    data.elec,
    data.water,
    data.street,
    data.clean,
    data.tree,
    data.footpath,
    data.traffic,
    data.smell,
    data.sound,
    data.etc,
  ];
  return (
    <Pie
      data={{
        labels: [
          'ไฟฟ้า',
          'ประปา',
          'ถนน',
          'ต้นไม้',
          'ความสะอาด',
          'ทางเท้า',
          'จราจร จอดรถ',
          'กลิ่น',
          'เสียง',
          'อื่นๆ'
        ],
        datasets: [
          {
            data: arrData,
            backgroundColor: [
              '#FF3300',
              '#66FFFF',
              '#6633FF',
              '#009900',
              '#996600',
              '#FF9933',
              '#FF33CC',
              '#9932CC',
              '#778899',
              '#000000',
            ],
            hoverBackgroundColor: [
              '#FF3300',
              '#66FFFF',
              '#6633FF',
              '#009900',
              '#996600',
              '#FF9933',
              '#FF33CC',
              '#9932CC',
              '#778899',
              '#000000',
            ],
          },
        ],
      }}
      width={400}
      height={600}
    ></Pie>
  );
};

export default StatKindChart;
