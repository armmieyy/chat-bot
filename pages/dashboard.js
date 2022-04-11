import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, orderByValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

function Home({}) {
  const [stat, setStat] = useState();
  const [fetchData, setFetchData] = useState([]);
  const [waitReply, setWaitReply] = useState([]);
  const route = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user === null) {
      route.push('/index');
    } else {
      onValue(ref(db, '/stat'), snapshot => {
        setStat(snapshot.val());
      });
      onValue(ref(db, '/order'), snapshot => {
        const res = snapshot.val();
        const arr = [];
        for (const key in res) {
          arr.push({ ...res[key], id: key });
        }
        setFetchData(arr);
      });
    }

    console.log(stat);
  }, [user, route]);

  useEffect(()=> {
    if(!fetchData) return
    const waitNo = fetchData.filter(item => item.status === "wait")
    const doneNo = fetchData.filter(item => item.status === "done")
    const inProgressNo = fetchData.filter(item => item.status === "inProgress")
    setWaitReply(waitNo)
  },[fetchData])

  const signout = () => {
    signOut(auth);
  };

  return (
    <div>
      <div>
        <Sidebar signOut={signout} />
      </div>
    </div>
  );
}

export default Home;
