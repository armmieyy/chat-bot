import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

const StatChart = ({ data }) => {
  Chart.register(ArcElement);
  const arrData = [
    data.wait,
    data.active_zone,
    data.receive,
    data.complete,
    data.notInvoled,
  ];
  return (
    <Pie
      data={{
        labels: [
          'รอลงเขตรับผิดชอบ',
          'รอการตรวจสอบ',
          'รับเรื่อง',
          'ดำเนินการเสร็จสิ้น',
          'ไม่เกี่ยวข้อง',
        ],
        datasets: [
          {
            data: arrData,
            backgroundColor: [
              '#22C55E',
              '#F97316',
              '#F59E0B',
              '#06B6D4',
              '#EF4444',
            ],
            hoverBackgroundColor: [
              '#22C55E',
              '#F97316',
              '#F59E0B',
              '#06B6D4',
              '#EF4444',
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
