import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';

function Report() {
  const [fetchData, setFetchData] = useState([]);
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
        arr = arr.filter(item => item.status === 'wait');
        setFetchData(arr);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!fetchData) return;
  }, [fetchData]);

  const signout = () => {
    signOut(auth);
  };

  return (
    <>
      <div>
        <Sidebar signOut={signout} />
        <h1>luv ink</h1>
        <div className="pt-4 px-12 h-screen">
          <table className="border border-blue-700 p-5 w-full h-[560px] table-fixed">
            <thead>
              <tr className="h-12 bg-blue-300">
                <th className="border border-blue-700 w-48">วัน เวลา</th>
                <th className="border border-blue-700 w-[423px]">เรื่อง</th>
                <th className="border border-blue-700 w-48 ">ประเภท</th>
                <th className="border border-blue-700 w-48">สถานะ</th>
              </tr>
            </thead>
            <tbody className="border border-blue-700">
              {fetchData &&
                fetchData.map(item => (
                  <tr
                    key={item.id}
                    className="cursor-pointer hover:bg-blue-100 h-8"
                    onClick={() => {
                      router.push(`/reply/${item.id}`)
                    }}
                  >
                    <th className="border border-blue-700 w-48">{item.date}</th>
                    <th className="border border-blue-700 w-[423px]">
                      {item.message}
                    </th>
                    <th className="border border-blue-700 w-48 ">
                      {item.kind}
                    </th>
                    <th className="border border-blue-700 w-48">
                      {item.status}
                    </th>
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
