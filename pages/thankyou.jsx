import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/layout/LayoutDefault';

function Thankyou() {
  const route = useRouter();
  const query = route.query.give;

  console.log(query);

  return (
    <Layout>
      <div className="text-center align-middle pt-80">
        {query ? (
          <div className="font-bold text-white text-xl ">
            คุณได้ทำแบบประเมินแล้ว
          </div>
        ) : (
          <div className="font-bold text-white text-xl ">
            ขอบคุณสำหรับการให้ <br />
            คะแนนความพึงพอใจ
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Thankyou;
