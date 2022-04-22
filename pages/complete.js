import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

function Home({}) {
  const [fetchData, setFetchData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [status, setStatus] = useState('complete');

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
        arr = arr.filter(
          item => item.status === 'complete' || item.status === 'notInvoled',
        );
        setFetchData(arr);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!status) return;

    console.log(status);
    setShowData(fetchData.filter(item => item.status == status));
  }, [fetchData, status]);

  const signout = () => {
    signOut(auth);
  };

  return (
    <>
      <div>
        <Sidebar signOut={signout} />
        <h1>luv ink</h1>

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
              <option className="text-lg" value="complete">
                ดำเนินการสำเร็จ
              </option>
              <option className="text-lg" value="notInvoled">
                ไม่เกี่ยวข้อง
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
                    <th className="border border-blue-700 w-48">{item.date}</th>
                    <th className="border border-blue-700 w-[423px]">
                      {item.message}
                    </th>
                    <th className="border border-blue-700 w-48 ">
                      {item.kind}
                    </th>
                    <th className="border border-blue-700 w-48">
                      {item.status === 'complete' && (
                        <span style={{ color: 'rgb(15, 176, 0)' }}>
                          ดำเนินการสำเร็จ
                        </span>
                      )}
                      {item.status === 'notInvoled' && (
                        <span className="text-red-600">ไม่เกี่ยวข้อง</span>
                      )}
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

export default Home;
