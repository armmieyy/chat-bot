import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, orderByValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';

function Dashboard({}) {
  const [stat, setStat] = useState({});
  const [kindStat, setKindStat] = useState({});
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

  useEffect(() => {
    if (!fetchData) return;
    const wait = fetchData.filter(item => item.status === 'wait');
    const done = fetchData.filter(item => item.status === 'done');
    const inProgress = fetchData.filter(item => item.status === 'inProgress');
    const inapposite = fetchData.filter(item => item.status === 'inapposite');
    const elec = fetchData.filter(item => item.kind === 'ไฟฟ้า');
    const water = fetchData.filter(item => item.kind === 'ประปา');
    const street = fetchData.filter(item => item.kind === 'ถนน');
    const clean = fetchData.filter(item => item.kind === 'ความสะอาด');
    const tree = fetchData.filter(item => item.kind === 'ต้นไม้');
    const footpath = fetchData.filter(item => item.kind === 'ทางเท้า');
    const traffic = fetchData.filter(item => item.kind === 'จราจร จอดรถ');
    const smell = fetchData.filter(item => item.kind === 'กลิ่น');
    const sound = fetchData.filter(item => item.kind === 'เสียง');

    setStat({
      ...Card,
      inProgress: inProgress.length,
      wait: wait.length,
      done: done.length,
      inapposite: inapposite.length,
    });
    setKindStat({
      ...kindStat,
      elec: elec.length,
      water: water.length,
      street: street.length,
      clean: clean.length,
      tree: tree.length,
      footpath: footpath.length,
      traffic: traffic.length,
      smell: smell.length,
      sound: sound.length,
    });
  }, [fetchData]);

  const signout = () => {
    signOut(auth);
  };

  const Card = ({ label, value }) => {
    return (
      <>
        <Col
          span={4}
          className="bg-gray-200 p-2 m-1 text-center rounded border-blue-600 border"
        >
          <span className="text-xl">{label}</span> <br />
          <span className="text-4xl">{value}</span>
        </Col>
      </>
    );
  };

  return (
    <>
      <Sidebar signOut={signout} />
      <div className="pt-4 px-12">
        <Row className="">
          <Card
            label={'จำนวนเรื่องทั้งหมด'}
            value={fetchData && fetchData.length}
          />
        </Row>
        <Row className="mt-1 space-x-1">
          <Card
            label={'รอรับเรื่อง'}
            value={stat?.inProgress && stat.inProgress}
          />
          <Card label={'กำลังดำเนินการ'} value={stat?.wait && stat.wait} />
          <Card label={'เสร็จสิ้น'} value={stat?.done && stat.done} />
          <Card
            label={'ไม่เกี่ยวข้อง'}
            value={stat?.inapposite && stat.inapposite}
          />
        </Row>
      </div>
      <Row className="mt-4 ">
        <Col span={24} className="bg-blue-500 p-4">
          <span className="text-xl text-white">การแจ้งแต่ละปัญหา</span>
        </Col>
      </Row>
      <Row className="mt-1 px-12">
        <Card label={'ไฟฟ้า'} value={kindStat?.elec && kindStat.elec} />
        <Card label={'ประปา'} value={kindStat?.water && kindStat.water} />
        <Card label={'ถนน'} value={kindStat?.street && kindStat.street} />
        <Card label={'ต้นไม้'} value={kindStat?.tree && kindStat.tree} />
        <Card label={'ความสะอาด'} value={kindStat?.clean && kindStat.clean} />
        <Card
          label={'ทางเท้า'}
          value={kindStat?.footpath && kindStat.footpath}
        />
        <Card
          label={'จราจร จอดรถ'}
          value={kindStat?.traffic && kindStat.traffic}
        />
        <Card label={'กลิ่น'} value={kindStat?.smell && kindStat.smell} />
        <Card label={'เสียง'} value={kindStat?.sound && kindStat.sound} />
      </Row>
    </>
  );
}

export default Dashboard;
