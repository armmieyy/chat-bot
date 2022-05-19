import { onValue, ref } from 'firebase/database';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../plugins/firebaseConfig';

function Navbar({ signOut, role, district }) {
  const [message, setMessage] = useState(0);
  const [allzone, setAllzone] = useState();
  const route = useRouter();
  const path = route.pathname;
  console.log(path);

  useEffect(() => {
    onValue(ref(db, '/district'), snapshot => {
      const res = snapshot.val();
      setAllzone(res);
    });
  }, []);

  useEffect(() => {
    if (role == 1) {
      onValue(ref(db, '/chat'), snapshot => {
        const res = snapshot.val();
        const arr = [];
        for (const key in res) {
          arr.push({ ...res[key], id: key });
        }
        setMessage(arr.filter(item => item.status == 'unread').length);
      });
    } else {
      onValue(ref(db, '/chat'), snapshot => {
        const res = snapshot.val();
        const arr = [];
        for (const key in res) {
          arr.push({ ...res[key], id: key });
        }
        setMessage(
          arr.filter(item => item.status == 'unread' && item.zone == district)
            .length,
        );
      });
    }
  }, [role, district]);
  return (
    <>
      <nav className="flex items-center flex-wrap bg-blue-800 p-3 ">
        <a className="inline-flex items-center p-2 mr-4 ">
          <div className="text-2xl text-white font-bold uppercase tracking-wide">
            ไลน์แชทบอทสำหรับแจ้งปัญหาในชุมชน
            <span className="text-xl text-yellow-500 ml-1">
              | {allzone && allzone[district]} {role == 1 && <>Super Admin</>}
            </span>
          </div>
        </a>
        <div className="hidden w-full lg:inline-flex lg:flex-grow lg:w-auto">
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
            {role == 1 && (
              <Link href="/Message">
                <a
                  className={
                    path == '/Message' || path == '/message'
                      ? 'relative lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center bg-blue-600 hover:text-white '
                      : 'relative lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white '
                  }
                >
                  ข้อมูลสอบถามทั่วไป
                  {message > 0 ? (
                    <span className="w-5 h-5 bg-red-500 absolute -right-1 -top-1 rounded-full text-center ">
                      <span className="relative -top-1">{message}</span>
                    </span>
                  ) : (
                    <></>
                  )}
                </a>
              </Link>
            )}
            {role === 1 ? (
              <Link href="/management">
                <a
                  className={
                    path == '/management'
                      ? 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center bg-blue-600 hover:text-white '
                      : 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white '
                  }
                >
                  พื้นที่รับผิดชอบ
                </a>
              </Link>
            ) : (
              <></>
            )}
            <Link href="/report">
              <a
                className={
                  path == '/report'
                    ? 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center bg-blue-600 hover:text-white '
                    : 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white '
                }
              >
                ข้อร้องเรียน
              </a>
            </Link>
            <Link href="/complete">
              <a
                className={
                  path == '/complete'
                    ? 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center bg-blue-600 hover:text-white '
                    : 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white'
                }
              >
                Complete
              </a>
            </Link>
            <Link href="/dashboard">
              <a
                className={
                  path == '/dashboard'
                    ? 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center bg-blue-600 hover:text-white'
                    : 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white'
                }
              >
                Dashboard
              </a>
            </Link>
            {role == 1 ? (
              <span className="ml-5">
                <Link href={'/setting'} passHref>
                  <a
                    className={
                      path == `/setting`
                        ? 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center bg-green-600 hover:text-white'
                        : 'lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white'
                    }
                  >
                    ตั้งค่าผู้ใช้
                  </a>
                </Link>
              </span>
            ) : (
              <></>
            )}
            <span className="" onClick={signOut}>
              <Link href={'/index'} passHref>
                <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-red-600 hover:text-white">
                  LogOut
                </a>
              </Link>
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
