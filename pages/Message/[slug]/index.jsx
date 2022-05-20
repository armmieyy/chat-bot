import { getAuth } from 'firebase/auth';
import { onValue, push, ref } from 'firebase/database';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { db } from '../../../plugins/firebaseConfig';
import { Row, Col } from 'antd';
import axios from 'axios';

function Index({ role, setRole, district, setDistrict }) {
  const [fetchData, setFetchData] = useState();
  const [allzone, setAllzone] = useState();
  const [reply, setReply] = useState();
  const route = useRouter();
  const { id, slug } = route.query;
  const API = process.env.NEXT_PUBLIC_API_FUNCTION;

  useEffect(() => {
    if (!id) return;
    onValue(ref(db, `/permission/${id}`), snapshot => {
      const res = snapshot.val();
      setRole(res.role);
      setDistrict(res.district);
    });
    onValue(ref(db, '/chat/' + slug), snapshot => {
      const res = snapshot.val();
      setFetchData(res);
      console.log(res);
    });
    onValue(ref(db, '/district'), snapshot => {
      const res = snapshot.val();
      setAllzone(res);
      console.log(res);
    });
  }, [route]);

  useEffect(() => {
    if (!role) return;
    if (role == 1) return;

    route.push('/dashboard');
  }, [role]);

  const sendReply = () => {
    const payload = {
      type: 'replyChat',
      msg: fetchData.message,
      reply: reply,
      date: new Date().toLocaleString('en-GB', {
        timeZone: 'Asia/Jakarta',
      }),
      uid: fetchData.from.userId,
      key: slug,
    };

    axios
      .post(API + 'chatbot-49334/us-central1/messageReply', payload)
      .then(res => {
        if (res.data == 'ok') {
          route.push('/Message');
        }
      });

    console.log(payload);
    // route.push('/Message');
  };
  return (
    <>
      <Navbar role={role} district={district} />
      <div className="p-8">
        <Row className="border p-5 rounded">
          <Col span={24}>
            <Row>
              <Col span={5}>
                <span className="text-3xl">จาก</span>
              </Col>
              <Col span={18} className="border-b">
                <span className="text-3xl">
                  {fetchData && fetchData.from.displayName}
                </span>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col span={5}>
                <span className="text-3xl">เวลา</span>
              </Col>
              <Col span={18} className="border-b">
                <span className="text-3xl">
                  {fetchData && fetchData.timestamp}
                </span>
              </Col>
            </Row>
            
            <Row className="mt-5">
              <Col span={5}>
                <span className="text-3xl">ข้อความ</span>
              </Col>
              <Col span={18} className="border p-2">
                <textarea
                  className="text-xl w-full h-36 p-3"
                  value={fetchData && fetchData.message}
                  disabled
                ></textarea>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="border p-5 rounded mt-5">
          <Col span={24}>
            <Row>
              <Col span={5}>
                <span className="text-3xl">ตอบกลับ</span>
              </Col>
              <Col span={18} className="border p-2">
                {!fetchData?.reply ? (
                  <>
                    <textarea
                      className="text-xl w-full h-36 p-3"
                      value={reply}
                      onChange={e => {
                        setReply(e.target.value);
                      }}
                    />
                  </>
                ) : (
                  <textarea
                    className="text-xl w-full h-36 p-3"
                    value={fetchData.reply}
                    disabled
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="end" className=" mt-5 mb-10">
          <Col className="space-x-2">
            <button
              className="p-5  border text-xl bg-blue-600 text-white
             rounded-lg hover:opacity-75"
              onClick={() => sendReply()}
              hidden={fetchData?.reply}
            >
              ส่งข้อความ
            </button>
            <button
              className="p-5  border text-xl bg-red-600 text-white
             rounded-lg hover:opacity-75"
              onClick={() => route.push(`/Message`)}
              hidden={fetchData?.reply}
            >
              ยกเลิก
            </button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Index;
