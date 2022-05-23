import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';
import { onValue, ref } from 'firebase/database';
import { db } from '../../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { Col, Row } from 'antd';
import axios from 'axios';

function Reply({ role, setRole }) {
  const router = useRouter();
  const [fetchData, setFetchData] = useState([]);
  const [textReply, setTextReply] = useState('');
  const [district, setDistrict] = useState([]);
  const [zone_control, setzone_control] = useState('');
  const [zone, setZone] = useState();
  const { slug } = router.query;
  const auth = getAuth();
  const user = auth.currentUser;
  const route = useRouter();
  const signout = () => {
    signOut(auth);
    route.push('/index');
  };

  useEffect(() => {
    if (!user) return;
    if (user === null) {
      router.push('/index');
    }

    onValue(ref(db, `/permission/${user.uid}`), snapshot => {
      const res = snapshot.val();
      setRole(res.role);
      setZone(res.district);
    });

    onValue(ref(db, `/district`), snapshot => {
      const res = snapshot.val();
      setDistrict(res);
    });
  }, [user]);

  useEffect(() => {
    if (!slug) return;
    onValue(ref(db, `/order/${slug}`), snapshot => {
      const res = snapshot.val();
      setFetchData(res);
    });
  }, [slug]);

  useEffect(() => {
    if (!fetch) return;
    setzone_control(fetchData.zone_control);
    setTextReply(fetchData?.reply || '');
  }, [fetchData]);

  const sendReply = async () => {
    await axios({
      method: 'post',
      url: 'http://localhost:5001/chatbot-49334/us-central1/messageReply',
      data: {
        type: 'reply',
        id: slug,
        textReply: textReply,
        title: fetchData.message,
        status: fetchData.status,
        image: fetchData.image,
        uid: fetchData.uid,
        date: fetchData.date,
      },
    })
      .then(res => {
        if (res.status === 200) {
          router.push('/report');
        }
      })
      .catch(err => {
        alert(err);
      });
  };

  const save = async (zone, id) => {
    axios({
      method: 'post',
      url: 'http://localhost:5001/chatbot-49334/us-central1/messageReply',
      data: {
        id: id,
        type: 'zone_control',
        zone_control: zone,
      },
    })
      .then(res => {
        router.push('/management?status=1');
      })
      .catch(err => {
        alert(err);
      });
  };

  const notInvoled = async () => {
    await axios({
      method: 'post',
      url: 'http://localhost:5001/chatbot-49334/us-central1/messageReply',
      data: {
        type: 'notInvoled',
        id: slug,
        uid: fetchData.uid,
        title: fetchData.message,
        date: fetchData.date,
        displayName: fetchData.displayName,
      },
    })
      .then(res => {
        if (res.status === 200) {
          router.push('/complete');
        }
      })
      .catch(err => {
        alert(err);
      });
  };

  const complete = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5001/chatbot-49334/us-central1/messageReply',
      data: {
        id: slug,
        uid: fetchData.uid,
        type: 'complete',
        image: fetchData.image,
        title: fetchData.message,
        date: fetchData.date,
      },
    })
      .then(res => {
        if (res.data == 'ok') {
          router.push('/complete');
        }
      })
      .catch(err => {
        alert(err);
      });
  };

  return (
    <>
      <Navbar signOut={signout} role={role} district={zone} />
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
              <Col span={6} className="mr-3">
                <label className="text-2xl ">พื้นที่รับผิดชอบ</label>
                <select
                  name=""
                  id=""
                  className="ml-2 w-1/3 p-1 text-xl border rounded "
                  value={zone_control}
                  disabled={
                    role == 2 ||
                    fetchData.status === 'complete' ||
                    fetchData.status === 'notInvoled' ||
                    fetchData.status == 'active_zone' ||
                    fetchData.status === 'receive'
                      ? true
                      : false
                  }
                  onChange={e => {
                    setzone_control(e.target.value);
                  }}
                >
                  <option key={0} value={0}>
                    -
                  </option>
                  {district &&
                    district.map((item, key) => (
                      <option key={item} value={key}>
                        {item}
                      </option>
                    ))}
                </select>
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

              <>
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
                        disabled={
                          fetchData.status === 'complete' ||
                          fetchData.status === 'notInvoled' ||
                          fetchData.status == 'receive'
                        }
                        onChange={e => setTextReply(e.target.value)}
                      ></textarea>
                    </Col>
                  </Row>
                  <Row className="mt-2 space-x-4">
                    <button
                      style={{ backgroundColor: 'rgb(15, 254, 0)' }}
                      className="w-1/6 hover:opacity-50 rounded p-1"
                      hidden={fetchData.status != 'receive'}
                      onClick={() => {
                        complete();
                      }}
                    >
                      เสร็จสิ้น
                    </button>
                    <button
                      className="p-2 px-6 bg-green-500 text-md border border-green-700 hover:bg-green-700 
                rounded-lg text-white"
                      onClick={() => save(zone_control, slug)}
                      hidden={
                        role != 1 ||
                        fetchData.status == 'active_zone' ||
                        fetchData.status === 'complete' ||
                        fetchData.status === 'notInvoled' ||
                        fetchData.status == 'receive'
                      }
                      disabled={
                        fetchData.status === 'complete' ||
                        fetchData.status === 'notInvoled' ||
                        fetchData.status == 'receive'
                      }
                    >
                      บันทึก
                    </button>
                    <button
                      className="p-2 bg-blue-500 text-md border border-blue-700 hover:bg-blue-700 
              rounded-lg text-white"
                      onClick={() => sendReply(textReply)}
                      hidden={
                        fetchData.status === 'complete' ||
                        fetchData.status === 'notInvoled' ||
                        fetchData.status == 'receive'
                      }
                      disabled={
                        fetchData.status === 'complete' ||
                        fetchData === 'notInvoled'
                      }
                    >
                      ส่งข้อความ
                    </button>
                    <button
                      className="p-2 bg-red-500 text-md border border-red-700 hover:bg-red-700 
              rounded-lg text-white"
                      onClick={() => {
                        notInvoled();
                      }}
                      hidden={
                        fetchData.status == 'active_zone' ||
                        fetchData.status === 'complete' ||
                        fetchData.status === 'notInvoled' ||
                        fetchData.status == 'receive'
                      }
                      disabled={
                        fetchData.status === 'complete' ||
                        fetchData.status === 'notInvoled' ||
                        fetchData.status == 'receive'
                      }
                    >
                      ไม่เกี่ยวข้อง
                    </button>
                    <button
                      className="p-2 bg-red-500 text-md border border-red-700 hover:bg-red-700 
              rounded-lg text-white"
                      onClick={() => {
                        router.push(`/${router.query.from || ''}`);
                      }}
                    >
                      ยกเลิก
                    </button>
                  </Row>
                </Col>
              </>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Reply;
