import React, { useState, useEffect } from 'react';
import { db } from '../../plugins/firebaseConfig';
import Layout from '../../components/layout/LayoutDefault';
import { Row, Col } from 'antd';
import { onValue, push, ref } from 'firebase/database';

function Index() {
  const [profile, setProfile] = useState();
  const [allzone, setAllzone] = useState();
  const [inputFrom, setInputFrom] = useState({ zone: '', message: '' });
  const [send, setSend] = useState(false);

  useEffect(() => {
    onValue(
      ref(db, '/district'),
      snapshot => {
        const res = snapshot.val();
        console.log(res);
        setAllzone(res);
      },
      err => {
        console(err);
      },
    );
  }, []);

  useEffect(async () => {
    const liff = (await import('@line/liff')).default;
    try {
      await liff.init({
        liffId: `1657138216-JeY5xaKM`,
      });
      liff.ready.then(() => {
        if (!liff.isLoggedIn()) liff.login();
        liff
          .getProfile()
          .then(profile => {
            setProfile(profile);
          })
          .catch(err => {
            console.log('error', err);
          });
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSubmit = () => {
    if (!profile) return;

    const payload = {
      zone: inputFrom.zone,
      message: inputFrom.message,
      from: {
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        userId: profile.userId,
      },
      status: 'unread',
      timestamp: new Date().toLocaleString('en-GB', {
        timeZone: 'Asia/Jakarta',
      }),
    };
    push(ref(db, '/chat'), payload).then(() => {
      setSend(true);
    });
  };

  return (
    <Layout className="h-screen">
      <Row className="">
        {send == true ? (
          <Col span={24} className="p-5 mt-52 text">
            <Row className="bg-white w-full p-4 rounded-lg">
              <Col span={24} className="text-center">
                <span>ขอบคุณที่ส่งข้อความหาเรา</span>
                <br />
                <span>เจ้าหน้าที่จะตอบกลับเร็วๆนี้</span>
              </Col>
            </Row>
          </Col>
        ) : (
          <Col span={24} className="p-5">
            <Row className="bg-white w-full p-4 rounded-lg">
              <form
                className="w-full"
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <Col span={24}>
                  <Row>
                    <Col span={24} className="text-center text-4xl">
                      <span>ติดต่อเจ้าหน้าที่</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={10}>เลือกพื้นที่รับผิดชอบ</Col>
                    <Col span={14}>
                      <select
                        required
                        name="zone"
                        id="zone"
                        value={inputFrom.zone}
                        className="w-full rounded border"
                        onChange={e => {
                          const val = e.target.value;
                          setInputFrom(prev => ({ ...prev, zone: val }));
                        }}
                      >
                        <option></option>
                        {allzone &&
                          allzone.map((item, index) => (
                            <option key={index} value={index}>
                              {item}
                            </option>
                          ))}
                      </select>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col span={10}>ข้อความ</Col>
                    <Col span={14}>
                      <textarea
                        required
                        name="message"
                        id="message"
                        value={inputFrom.message}
                        className="w-full bg-gray-200 border rounded-lg h-36 p-1"
                        onChange={e => {
                          const val = e.target.value;
                          setInputFrom(prev => ({ ...prev, message: val }));
                        }}
                      ></textarea>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col span={24}>
                      <button
                        type="submit"
                        className="w-full border bg-blue-400 rounded text-white h-10"
                      >
                        ส่งข้อความ
                      </button>
                    </Col>
                  </Row>
                </Col>
              </form>
            </Row>
          </Col>
        )}
      </Row>
    </Layout>
  );
}

export default Index;
