import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';
import axios from 'axios';

function Report() {
  const [fetchData, setFetchData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [status, setStatus] = useState('wait');

  const route = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

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
        
        setFetchData(arr);
      });
    }
  }, [user]);


  useEffect(() => {
    if (!status) return;
    setShowData(fetchData.filter(item => item.status === status));
  }, [fetchData, status]);

  const signout = () => {
    signOut(auth);
  };

  const complete = key => {
    const arr = showData.filter(item => item.id === key);
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
    }).then(res => {}).catch(err => {alert(err)});
  };

  return (
    <>
      <div>
        <Sidebar signOut={signout} />

        <div className="pt-4 px-12 h-screen">
          <div className="flex justify-end mb-4">
            <label htmlFor="" className="mr-4 text-lg">
              สถานะ
            </label>
            <select
              name=""
              id=""
              defaultValue={'wait'}
              className="border border-blue-700 rounded"
              onChange={e => {
                setStatus(e.target.value);
              }}
            >
              <option className="text-lg" value="wait">
                รอการตรวจสอบ
              </option>
              <option className="text-lg" value="inProgress">
                รอผู้ใช้ส่งข้อมูล
              </option>
              <option className="text-lg" value="receive">
                รับเรื่อง
              </option>
            </select>
          </div>
          <table className="border border-blue-700 p-5 w-full h-[560px] table-fixed">
            <thead>
              <tr className="h-12 bg-blue-300">
                <th className="border border-blue-700 w-48">วัน เวลา</th>
                <th className="border border-blue-700 w-[423px]">เรื่อง</th>
                <th className="border border-blue-700 w-48 ">ประเภท</th>
                <th className="border border-blue-700 w-48">สถานะ</th>
                {status === 'receive' ? (
                  <th className="border border-blue-700 w-32">Action</th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody className="border border-blue-700">
              {showData &&
                showData.map(item => (
                  <tr
                    key={item.id}
                    className="cursor-pointer hover:bg-blue-100 h-10"
                  >
                    <th
                      className="border border-blue-700 w-48"
                      onClick={() => {
                        router.push(`/reply/${item.id}`);
                      }}
                    >
                      {item.date}
                    </th>
                    <th
                      className="border border-blue-700 w-[423px]"
                      onClick={() => {
                        router.push(`/reply/${item.id}`);
                      }}
                    >
                      {item.message}
                    </th>
                    <th
                      className="border border-blue-700 w-48 "
                      onClick={() => {
                        router.push(`/reply/${item.id}`);
                      }}
                    >
                      {item.kind}
                    </th>
                    <th
                      className="border border-blue-700 w-48"
                      onClick={() => {
                        router.push(`/reply/${item.id}`);
                      }}
                    >
                      {item.status === 'wait' && 'รอการตรวจสอบ'}
                      {item.status === 'inProgress' && 'รอผู้ใช้ส่งข้อมูล'}
                      {item.status === 'receive' && 'รับเรื่อง'}
                    </th>

                    {status === 'receive' ? (
                      <th className="border border-blue-700 w-32">
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
        </div>
      </div>
    </>
  );
}

export default Report;
