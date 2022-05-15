import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';
import axios from 'axios';
import Link from 'next/link';

function Management({ role, district }) {
  const optKind = [
    'ทั้งหมด',
    'ประปา',
    'อื่นๆ',
    'ถนน',
    'ต้นไม้',
    'ความสะอาด',
    'ไฟฟ้า',
    'ทางเท้า',
    'จราจร จอดรถ',
    'กลิ่น',
    'เสียง',
  ];
  const [fetchData, setFetchData] = useState([]);
  const [fillterData, setFillterData] = useState([]);
  const [showData, setShowdata] = useState([]);
  const [status, setStatus] = useState('wait');
  const [row, setRow] = useState(10);
  const [kind, setKind] = useState();
  const [currentpage, setCurrentpage] = useState(1);
  const [totalpage, setTotalpage] = useState();
  const route = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const query = route.query;

  useEffect(() => {
    if (user === null) {
      route.push('/index');
    } else {
      onValue(ref(db, '/order'), snapshot => {
        const res = snapshot.val();
        let arr = [];
        for (const key in res) {
          arr.push({ ...res[key], id: key });
        }

        arr = arr.filter(item => item.status !== 'complete');

        setFetchData(arr);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!query?.status) return;

    if (query.status == 1) {
      setStatus('active_zone');
    }
  }, [query]);

  useEffect(() => {
    if (!status) return;
    setFillterData(fetchData.filter(item => item.status === status));
    if (!kind) return;
    setFillterData(
      fetchData.filter(item => item.kind === kind && item.status === status),
    );

    if (kind === 'ทั้งหมด') {
      setFillterData(fetchData.filter(item => item.status === status));
    }
  }, [fetchData, status, kind]);

  useEffect(() => {
    if (!fillterData) return;
    setTotalpage(Math.ceil(fillterData.length / 10));

    if (currentpage === 1) {
      setShowdata(fillterData.slice(currentpage - 1, 10));
    } else {
      setShowdata(fillterData.slice(currentpage * 10 - 10, currentpage * 10));
    }
  }, [fillterData, currentpage]);

  const reset = () => {
    setStatus('wait');
    setKind('ทั้งหมด');
    setFillterData(fetchData.filter(item => item.status === status));
  };

  const nextpage = () => {
    if (currentpage < totalpage) setCurrentpage(currentpage + 1);
  };
  const prevpage = () => {
    if (currentpage > 1) setCurrentpage(currentpage - 1);
  };

  const signout = () => {
    signOut(auth);
    route.push('/index')
  };

  const complete = key => {
    const arr = fillterData.filter(item => item.id === key);
    const data = arr[0];
    axios({
      method: 'post',
      url: 'http://localhost:5001/chatbot-49334/us-central1/messageReply',
      data: {
        id: key,
        uid: data.uid,
        type: 'complete',
        image: data.image,
        title: data.message,
        date: data.date,
      },
    })
      .then(res => {})
      .catch(err => {
        alert(err);
      });
  };

  return (
    <>
      <div>
        <Sidebar signOut={signout} role={role} district={district}/>

        <div className="pt-4 px-12">
          <div className="flex justify-end mb-4">
            <div className="mr-4">
              <button
                className="h-full w-full p-1 rounded text-white bg-blue-600"
                onClick={() => reset()}
              >
                รีเซ็ต
              </button>
            </div>
            <div className="mr-4">
              <label htmlFor="" className="mr-4 text-lg">
                ประเภท
              </label>
              <select
                name=""
                id="kind"
                value={kind}
                className="border border-blue-700 rounded"
                onChange={e => {
                  if (e.target.value === 'ทั้งหมด') {
                    setFillterData(
                      fetchData.filter(item => item.status === status),
                    );
                    setKind(e.target.value);
                  } else {
                    setKind(e.target.value);
                  }
                }}
              >
                {optKind.map((e, i) => (
                  <option key={i} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="" className="mr-4 text-lg">
                สถานะ
              </label>
              <select
                name=""
                id="status"
                value={status}
                className="border border-blue-700 rounded"
                onChange={e => {
                  setStatus(e.target.value);
                }}
              >
                <option className="text-lg" value="wait">
                  รอลงเขตรับผิดชอบ
                </option>
                <option className="text-lg" value="active_zone">
                  ลงเขตรับผิดชอบแล้ว
                </option>
              </select>
            </div>
          </div>
          <Row
            style={{ height: '450px' }}
            className=" w-full border  bg-gray-100"
          >
            <Col span={24}>
              <table className="  p-5 w-full  table-fixed">
                <thead className="w-full">
                  <tr className="h-12 bg-blue-300 border-blue-700 border">
                    <th className="border-b border border-blue-700 w-16">
                      ลำดับ
                    </th>
                    <th className="border-b border-r  border-blue-700 w-48">
                      วัน เวลา
                    </th>
                    <th className="border-b border-r border-blue-700 w-[423px]">
                      รายละเอียด
                    </th>
                    <th className="border-b border-r border-blue-700 w-32">
                      จาก
                    </th>
                    <th className="border-b border-r border-blue-700 w-28">
                      ประเภท
                    </th>
                    {status == 'active_zone' || status == 'receive' ? (
                      <th className="border-b border-r border-blue-700 w-48 ">
                        พื้นที่รับผิดชอบ
                      </th>
                    ) : (
                      <></>
                    )}
                    <th className="border-b border-l border-blue-700 w-48">
                      สถานะ
                    </th>
                    {status === 'receive' ? (
                      <th className="border-b border-l  border-blue-700 w-32">
                        Action
                      </th>
                    ) : (
                      <></>
                    )}
                  </tr>
                </thead>
                <tbody className="">
                  {showData &&
                    showData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer hover:bg-blue-100 h-10 border border-blue-700"
                      >
                        <Link href={`/Reply/${item.id}`}>
                          <th className="border-b border-r border-blue-700 w-48">
                            {currentpage === 1 && index + 1}
                            {currentpage > 1 &&
                              index + 1 + currentpage * 10 - 10}
                          </th>
                        </Link>
                        <Link href={`/Reply/${item.id}`}>
                          <th className="border-b border-r border-blue-700 w-48">
                            {item.date}
                          </th>
                        </Link>

                        <th
                          className="border-b border-r border-blue-700 w-[423px]"
                          onClick={() => {
                            router.push(`/Reply/${item.id}`);
                          }}
                        >
                          {item.message}
                        </th>
                        <th
                          className="border-b border-r border-blue-700 w-32"
                          onClick={() => {
                            router.push(`/Reply/${item.id}`);
                          }}
                        >
                          {item.displayName}
                        </th>
                        <th
                          className="border-b border-r border-blue-700 w-48 "
                          onClick={() => {
                            router.push(`/Reply/${item.id}`);
                          }}
                        >
                          {item.kind}
                        </th>
                        {status === 'active_zone' || status === 'receive' ? (
                          <th
                            className="border-b border-r border-blue-700 w-48 "
                            onClick={() => {
                              router.push(`/Reply/${item.id}`);
                            }}
                          >
                            {item.zone_control == 1 && <>ศรีวิชัย</>}
                            {item.zone_control == 2 && <>นครพิงค์</>}
                            {item.zone_control == 3 && <>เม็งราย</>}
                            {item.zone_control == 4 && <>กาวิละ</>}
                          </th>
                        ) : (
                          <></>
                        )}
                        <th
                          className="border-b border-r border-blue-700 w-48"
                          onClick={() => {
                            router.push(`/Reply/${item.id}`);
                          }}
                        >
                          {item.status === 'wait' && 'รอลงเขตรับผิดชอบ'}
                          {item.status === 'active_zone' &&
                            'ลงเขตรับผิดชอบแล้ว'}
                          {item.status === 'receive' && 'รับเรื่อง'}
                        </th>

                        {status === 'receive' ? (
                          <th className="border-b border-l border-blue-700 w-32">
                            <button
                              style={{ backgroundColor: 'rgb(15, 254, 0)' }}
                              className="w-1/2 hover:opacity-50 rounded p-1"
                              onClick={() => {
                                complete(item.id);
                              }}
                            >
                              เสร็จสิ้น
                            </button>
                          </th>
                        ) : (
                          <></>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </Col>
          </Row>
          <Row justify="center" className="mt-3">
            <div className="flex space-x-3 items-center">
              <button
                className="bg-blue-300 p-1 rounded "
                onClick={() => {
                  prevpage();
                }}
              >
                กลับ
              </button>
              <span className="text-xl">
                {currentpage} / {totalpage}
              </span>
              <button
                className="bg-blue-300 p-1 rounded"
                onClick={() => {
                  nextpage(1, currentpage);
                }}
              >
                ต่อไป
              </button>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Management;
