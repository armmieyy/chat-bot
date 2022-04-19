import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';
import { onValue, ref } from 'firebase/database';
import { db } from '../../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { Col, Row } from 'antd';
import axios from 'axios';
import { async } from '@firebase/util';

function Reply() {
  const router = useRouter();
  const [fetchData, setFetchData] = useState([]);
  const [textReply, setTextReply] = useState('');
  const { slug } = router.query;
  const auth = getAuth();
  const user = auth.currentUser;
  const signout = () => {
    signOut(auth);
  };

  useEffect(() => {
    if (!user) return;
    if (user === null) {
      router.push('/index');
    }
  }, [user]);

  useEffect(() => {
    if (!slug) return;

    onValue(ref(db, `/order/${slug}`), snapshot => {
      const res = snapshot.val();
      setFetchData(res);
    });
  }, [slug]);

  const sendReply = async () => {
    console.log(textReply);
    await axios({
      method: 'post',
      url: 'http://localhost:5001/chatbot-49334/us-central1/messageReply',
      data: { textReply: textReply, uid: fetchData.uid, date: fetchData.date },
    });
  };

  return (
    <>
      <Navbar signOut={signout} />

      <div className="pt-4 px-12">
        <Row className="border p-9 rounded-lg shadow-lg">
          <Col span={24}>
            <Row>
              <Col span={2}>
                <span className="text-2xl">เรื่อง : </span>
              </Col>
              <Col span={15} className="border-b mr-3">
                <span className="text-2xl ">{fetchData.message}</span>
              </Col>
              <Col span={2}>
                <span className="text-2xl">ประเภท : </span>
              </Col>
              <Col span={4} className="border-b">
                <span className="text-2xl ">{fetchData.kind}</span>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={2}>
                <span className="text-2xl">เวลา : </span>
              </Col>
              <Col span={15} className="border-b mr-3">
                <span className="text-2xl ">{fetchData.date}</span>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={2}>
                <span className="text-2xl">จาก : </span>
              </Col>
              <Col span={15} className="border-b mr-3">
                <span className="text-2xl ">{fetchData.displayName}</span>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={2}>
                <span className="text-2xl">สถานที่ : </span>
              </Col>
              <Col span={15} className="border-b mr-3">
                <span className="text-2xl ">
                  {fetchData?.location?.address && fetchData.location.address}
                </span>
              </Col>
              <Col span={6}>
                <a
                  href={
                    fetchData?.location?.address &&
                    `https://www.google.co.th/maps/search/${fetchData.location
                      .la +
                      '+' +
                      fetchData.location.lo}`
                  }
                  target="_blank"
                  className="text-white"
                >
                  <button
                    className="bg-blue-400 border-blue-700 rounded-xl text-white text-xl  
                border w-48 h-12 hover:bg-blue-700"
                  >
                    แผนที่
                  </button>
                </a>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={12}>
                <img
                  src={fetchData?.image && fetchData.image}
                  className="w-1/2 h-auto"
                />
              </Col>
              <Col span={12}>
                <Row className="mt-4">
                  <Col span={24}>
                    <span className="text-2xl">ตอบกลับ</span>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col span={24}>
                    <textarea
                      value={textReply}
                      rows="8"
                      className="w-full border p-5 text-xl"
                      onChange={e => setTextReply(e.target.value)}
                    ></textarea>
                  </Col>
                </Row>
                <Row className="mt-2 space-x-4">
                  <button
                    className="p-2 bg-blue-500 text-md border border-blue-700 hover:bg-blue-700 
                  rounded-lg text-white"
                    onClick={() => sendReply(textReply)}
                  >
                    ส่งข้อความ
                  </button>
                  <button
                    className="p-2 bg-red-500 text-md border border-red-700 hover:bg-red-700 
                  rounded-lg text-white"
                  >
                    ไม่เกี่ยวข้อง
                  </button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Reply;
