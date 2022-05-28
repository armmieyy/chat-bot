import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { set } from 'nprogress';
import exportFromJSON from 'export-from-json';

function Report({ role, district, setRole, setDistrict }) {
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
  const [status, setStatus] = useState('active_zone');
  const [row, setRow] = useState(10);
  const [kind, setKind] = useState();
  const [currentpage, setCurrentpage] = useState(1);
  const [totalpage, setTotalpage] = useState();
  const [allzone, setAllzone] = useState();
  const route = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      route.push('/index');
    } else {
      onValue(ref(db, `/permission/${user.uid}`), snapshot => {
        const res = snapshot.val();
        setRole(res.role);
        setDistrict(res.district);
      });
      onValue(ref(db, '/district'), snapshot => {
        const res = snapshot.val();
        setAllzone(res);
      });
    }
  }, [user]);

  useEffect(() => {
    onValue(ref(db, '/order'), snapshot => {
      const res = snapshot.val();
      let arr = [];
      for (const key in res) {
        arr.push({ ...res[key], id: key });
      }
      if (role == 1) {
        arr = arr.filter(item => item.status !== 'complete');
      } else {
        arr = arr.filter(item => item.zone_control == district);
      }
      setFetchData(arr);
    });
  }, [district, role]);

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
    setStatus('active_zone');
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
    router.push('/index');
  };

  const complete = key => {
    const arr = fillterData.filter(item => item.id === key);
    const data = arr[0];
    axios({
      method: 'post',
      url: process.env.NEXT_PUBLIC_API_FUNCTION + '/messageReply',
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

  const exportCSV = () => {
    let d;
    if (kind == 'ทั้งหมด') {
      d = fetchData.filter(value => value.status == status);
    } else {
      d = fetchData.filter(
        value => value.status == status && value.kind == kind,
      );
    }

    const data = [];
    for (let i = 0; i < d.length; i++) {
      let status = '';
      switch (d[i].status) {
        case 'active_zone':
          status = 'รอการตรวจสอบ';
          break;
        case 'receive':
          status = 'รับเรื่อง';
          break;
        default:
          return;
      }
      data.push({
        ลำดับ: i + 1,
        วันเวลา: d[i].date || '',
        รายละเอียด: d[i].message || '',
        จาก: d[i].displayName || '',
        ประเภท: d[i].kind || '',
        พื้นที่รับผิดชอบ: allzone[d[i].zone_control] || '',
        สถานะ: status,
        ตำแหน่ง: d[i]?.location?.address || '',
      });
    }
    const fileName =
      status +
      new Date().toLocaleString('en-GB', {
        timeZone: 'Asia/Jakarta',
      });
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };

  return (
    <>
      <div>
        <Sidebar signOut={signout} role={role} district={district} />
        <div className="pt-4 px-12">
          <div className="flex justify-end mb-4">
            <div className="mr-4">
              <button
                className="h-full w-full p-1 rounded text-white bg-green-600"
                onClick={() => exportCSV()}
              >
                Export
              </button>
            </div>
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
                defaultValue={'active_zone'}
                className="border border-blue-700 rounded"
                onChange={e => {
                  setStatus(e.target.value);
                }}
              >
                <option className="text-lg" value="active_zone">
                  รอการตรวจสอบ
                </option>

                <option className="text-lg" value="receive">
                  รับเรื่อง
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
                    <th className="border-b border-r border-blue-700 w-44">
                      จาก
                    </th>
                    <th className="border-b border-r border-blue-700 w-32 ">
                      ประเภท
                    </th>
                    <th className="border-b border-r border-blue-700 w-48 ">
                      พื้นที่รับผิดชอบ
                    </th>
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
                        <Link href={`/Reply/${item.id}?from=report`}>
                          <th className="border-b border-r border-blue-700 w-16">
                            {currentpage === 1 && index + 1}
                            {currentpage > 1 &&
                              index + 1 + currentpage * 10 - 10}
                          </th>
                        </Link>
                        <Link href={`/Reply/${item.id}?from=report`}>
                          <th className="border-b border-r border-blue-700 w-48">
                            {item.date}
                          </th>
                        </Link>

                        <th
                          className="border-b border-r border-blue-700 w-[423px]"
                          onClick={() => {
                            router.push(`/Reply/${item.id}?from=report`);
                          }}
                        >
                          {item.message}
                        </th>
                        <th
                          className="border-b border-r border-blue-700 w-44"
                          onClick={() => {
                            router.push(`/Reply/${item.id}?from=report`);
                          }}
                        >
                          {item.displayName}
                        </th>
                        <th
                          className="border-b border-r border-blue-700 w-32 "
                          onClick={() => {
                            router.push(`/Reply/${item.id}?from=report`);
                          }}
                        >
                          {item.kind}
                        </th>
                        <th className="border-b border-r border-blue-700 w-48 ">
                          {allzone && item && <>{allzone[item.zone_control]}</>}
                        </th>
                        <th
                          className="border-b border-r border-blue-700 w-48"
                          onClick={() => {
                            router.push(`/Reply/${item.id}?from=report`);
                          }}
                        >
                          {item.status === 'active_zone' && 'รอการตรวจสอบ'}
                          {item.status === 'inProgress' && 'รอผู้ใช้ส่งข้อมูล'}
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

export default Report;
