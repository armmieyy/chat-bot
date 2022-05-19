import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';
import Link from 'next/link';
import exportFromJSON from 'export-from-json';

function Home({ role, district, setDistrict, setRole }) {
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
  const [status, setStatus] = useState('complete');
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
    if (!role) return;
    onValue(ref(db, '/order'), snapshot => {
      const res = snapshot.val();
      let arr = [];
      for (const key in res) {
        arr.push({ ...res[key], id: key });
      }
      arr = arr.filter(
        item => item.status === 'complete' || item.status === 'notInvoled',
      );
      if (role == 1) {
        setFetchData(arr);
      } else {
        setFetchData(arr.filter(item => item.zone_control == district));
      }
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
    setStatus('complete');
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
    route.push('/index');
  };
  const exportCSV = () => {
    let d = fillterData;
    // if (kind == 'ทั้งหมด') {
    //   d = fillterData.filter(value => value.status == status);
    //   console.log(d)
    // } else {
    //   d = fillterData.filter(
    //     value => value.status == status && value.kind == kind,
    //   );

    const data = [];
    for (let i = 0; i < d.length; i++) {
      let status = '';
      switch (d[i].status) {
        case 'complete':
          status = 'ดำเนินการเสร็จสิ้น';
          break;
        case 'notInvoled':
          status = 'ไม่เกี่ยวข้อง';
          break;
        default:
          return;
      }
      console.log(d[i]);
      data.push({
        ลำดับ: i + 1,
        วันเวลา: d[i].date || '',
        รายละเอียด: d[i].message || '',
        จาก: d[i].displayName || '',
        ประเภท: d[i].kind || '',
        พื้นที่รับผิดชอบ: allzone[d[i].zone_control] || '',
        คะแนนความพึงพอใจ: d[i]?.giveRate || '-',
        สถานะ: status || '',
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
          <Row></Row>
          <div className="flex justify-end mb-4">
            <div className="flex justify-end mr-4">
              <button
                className="h-full w-full p-1 rounded text-white bg-green-600 mr-4"
                onClick={() => exportCSV()}
              >
                Export
              </button>

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
                defaultValue={'wait'}
                className="border border-blue-700 rounded"
                onChange={e => {
                  setStatus(e.target.value);
                }}
              >
                <option className="text-lg" value="complete">
                  ดำเนินการเสร็จสิ้น
                </option>
                <option className="text-lg" value="notInvoled">
                  ไม่เกี่ยวข้อง
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
                    <th className="border-b border-r border-blue-700 w-96">
                      รายละเอียด
                    </th>
                    <th className="border-b border-r border-blue-700 w-32">
                      จาก
                    </th>
                    <th className="border-b border-r border-blue-700 w-28">
                      ประเภท
                    </th>

                    {role === 1 && status != 'notInvoled' ? (
                      <th className="border-b border-r border-blue-700 w-32 ">
                        พื้นที่รับผิดชอบ
                      </th>
                    ) : (
                      <></>
                    )}
                    <th className="border-b border-r border-blue-700 w-28">
                      คะแนนความพึงพอใจ
                    </th>
                    <th className="border-b border-l border-blue-700 w-28">
                      สถานะ
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {showData &&
                    showData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer hover:bg-blue-100 h-10 border border-blue-700"
                      >
                        <Link href={`/Reply/${item.id}?from=complete`}>
                          <th className="border-b border-r border-blue-700 w-48">
                            {currentpage === 1 && index + 1}
                            {currentpage > 1 &&
                              index + 1 + currentpage * 10 - 10}
                          </th>
                        </Link>
                        <Link href={`/Reply/${item.id}?from=complete`}>
                          <th className="border-b border-r border-blue-700 w-48">
                            {item.date}
                          </th>
                        </Link>

                        <th
                          className="border-b border-r border-blue-700 w-96"
                          onClick={() => {
                            router.push(`/Reply/${item.id}?from=complete`);
                          }}
                        >
                          {item.message}
                        </th>
                        <th
                          className="border-b border-r border-blue-700 w-32"
                          onClick={() => {
                            router.push(`/Reply/${item.id}?from=complete`);
                          }}
                        >
                          {item.displayName}
                        </th>
                        <th
                          className="border-b border-r border-blue-700 w-48 "
                          onClick={() => {
                            router.push(`/Reply/${item.id}?from=complete`);
                          }}
                        >
                          {item.kind}
                        </th>

                        {role === 1 && status != 'notInvoled' ? (
                          <th
                            className="border-b border-r border-blue-700 w-24 "
                            onClick={() => {
                              router.push(`/Reply/${item.id}?from=complete`);
                            }}
                          >
                            {allzone && item && (
                              <>{allzone[item.zone_control]}</>
                            )}
                          </th>
                        ) : (
                          <></>
                        )}
                        <th className="border-b border-r border-blue-700 w-28">
                          {item?.giveRate ? item.giveRate : <>-</>}
                        </th>
                        <th
                          className="border-b border-r border-blue-700 w-48"
                          onClick={() => {
                            router.push(`/Reply/${item.id}?from=complete`);
                          }}
                        >
                          {item.status === 'complete' && (
                            <span style={{ color: 'rgb(15, 176, 0)' }}>
                              ดำเนินการเสร็จสิ้น
                            </span>
                          )}
                          {item.status === 'notInvoled' && (
                            <span className="text-red-500">ไม่เกี่ยวข้อง</span>
                          )}
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

export default Home;
