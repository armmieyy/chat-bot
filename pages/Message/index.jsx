import Sidebar, { Navbar } from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';
import axios from 'axios';
import Link from 'next/link';

function Index({ role, district, setRole, setDistrict }) {
  const [fetchData, setFetchData] = useState([]);
  const [fillterData, setFillterData] = useState([]);
  const [showData, setShowdata] = useState([]);
  const [row, setRow] = useState(10);
  const [currentpage, setCurrentpage] = useState(1);
  const [totalpage, setTotalpage] = useState();
  const [allzone, setAllzone] = useState();
  const route = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const [status, setStatus] = useState('unread');
  useEffect(() => {
    if (user == null) {
      route.push('/index');
    } else {
      onValue(ref(db, `/permission/${user.uid}`), snapshot => {
        const res = snapshot.val();
        setRole(res.role);
        setDistrict(res.district);
      });
    }
  }, [user]);

  useEffect(() => {
    if (role == 1) {
      onValue(ref(db, '/chat'), snapshot => {
        const res = snapshot.val();
        let arr = [];
        for (const key in res) {
          arr.push({ ...res[key], id: key });
        }
        arr = arr.filter(item => item.status == status);
        setFillterData(arr);
      });
    } else {
      onValue(ref(db, '/chat'), snapshot => {
        const res = snapshot.val();
        let arr = [];
        for (const key in res) {
          arr.push({ ...res[key], id: key });
        }
        arr = arr.filter(
          item => item.status == status && item.zone == district,
        );
        setFillterData(arr);
      });
    }
    onValue(ref(db, '/district'), snapshot => {
      const res = snapshot.val();
      setAllzone(res);
    });
  }, [role, district, status]);

  useEffect(() => {
    if (!fillterData) return;
    setTotalpage(Math.ceil(fillterData.length / 10));
    if (currentpage === 1) {
      setShowdata(fillterData.slice(currentpage - 1, 10));
    } else {
      setShowdata(fillterData.slice(currentpage * 10 - 10, currentpage * 10));
    }
  }, [fillterData, currentpage]);

  const nextpage = () => {
    if (currentpage < totalpage) setCurrentpage(currentpage + 1);
  };
  const prevpage = () => {
    if (currentpage > 1) setCurrentpage(currentpage - 1);
  };

  const signout = () => {
    signOut(auth);
    route.push('/index');
  };

  return (
    <>
      <div>
        <Sidebar signOut={signout} role={role} district={district} />

        <div className="pt-4 px-12">
          <div className="flex justify-end mb-4"></div>
          <Row className="mb-3">
            <Col span={24} className="space-x-3">
              <input
                type="checkbox"
                id=""
                value={'true'}
                onChange={e => {
                  const val = e.target.checked;
                  if (val == true) {
                    setStatus('reply');
                  } else {
                    setStatus('unread');
                  }
                }}
              />

              <label htmlFor="">ข้อความที่ตอบกลับแล้ว</label>
            </Col>
          </Row>
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

                    <th className="border-b border-r border-blue-700 w-32">
                      จาก
                    </th>

                    {/* <th className="border-b border-r border-blue-700 w-48 ">
                      พื้นที่รับผิดชอบ
                    </th> */}
                  </tr>
                </thead>
                <tbody className="">
                  {showData &&
                    showData.map((item, index) => (
                      <tr
                        key={index}
                        className="cursor-pointer hover:bg-blue-100 h-10 border border-blue-700"
                      >
                        <Link href={`/Message/${item.id}?id=${user.uid}`}>
                          <th className="border-b border-r border-blue-700 w-48">
                            {currentpage === 1 && index + 1}
                            {currentpage > 1 &&
                              index + 1 + currentpage * 10 - 10}
                          </th>
                        </Link>
                        <Link href={`/Message/${item.id}?id=${user.uid}`}>
                          <th className="border-b border-r border-blue-700 w-48">
                            {item.timestamp}
                          </th>
                        </Link>
                        <Link href={`/Message/${item.id}?id=${user.uid}`}>
                          <th className="border-b border-r border-blue-700 w-32">
                            {item.from.displayName}
                          </th>
                        </Link>
                        {/* <Link href={`/Message/${item.id}?id=${user.uid}`}>
                          <th className="border-b border-r border-blue-700 w-48 ">
                            {allzone && allzone[item.zone]}
                          </th>
                        </Link> */}
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

export default Index;
