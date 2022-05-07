import Sidebar, { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, orderByValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';
import StatChart from '../components/chart/StatChart';
import StatKindChart from '../components/chart/kindStat';
import StatZoneChart from '../components/chart/zoneStat';

function Dashboard({ role, district, setDistrict, setRole }) {
  const [stat, setStat] = useState({});
  const [kindStat, setKindStat] = useState({});
  const [zoneStat, setZoneStat] = useState({});
  const [fetchData, setFetchData] = useState([]);
  const [waitReply, setWaitReply] = useState([]);
  const route = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user === null) {
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
    onValue(ref(db, '/stat'), snapshot => {
      setStat(snapshot.val());
    });
    onValue(ref(db, '/order'), snapshot => {
      const res = snapshot.val();
      let arr = [];
      for (const key in res) {
        arr.push({ ...res[key], id: key });
      }
      console.log(district);
      if (district != 0) {
        arr = arr.filter(item => item.zone_control == district);
      }
      setFetchData(arr);
    });
  }, [district, role]);

  useEffect(() => {
    if (!fetchData) return;
    const wait = fetchData.filter(item => item.status === 'wait');
    const complete = fetchData.filter(item => item.status === 'complete');
    const active_zone = fetchData.filter(item => item.status === 'active_zone');
    const receive = fetchData.filter(item => item.status === 'receive');
    const notInvoled = fetchData.filter(item => item.status === 'notInvoled');
    const elec = fetchData.filter(item => item.kind === 'ไฟฟ้า');
    const water = fetchData.filter(item => item.kind === 'ประปา');
    const street = fetchData.filter(item => item.kind === 'ถนน');
    const clean = fetchData.filter(item => item.kind === 'ความสะอาด');
    const tree = fetchData.filter(item => item.kind === 'ต้นไม้');
    const footpath = fetchData.filter(item => item.kind === 'ทางเท้า');
    const traffic = fetchData.filter(item => item.kind === 'จราจร จอดรถ');
    const smell = fetchData.filter(item => item.kind === 'กลิ่น');
    const sound = fetchData.filter(item => item.kind === 'เสียง');
    const etc = fetchData.filter(item => item.kind === 'อื่นๆ');
    const zone_1 = fetchData.filter(item => item.zone_control == 1);
    const zone_2 = fetchData.filter(item => item.zone_control == 2);
    const zone_3 = fetchData.filter(item => item.zone_control == 3);
    const zone_4 = fetchData.filter(item => item.zone_control == 4);

    setStat({
      ...Card,
      wait: wait.length,
      complete: complete.length,
      active_zone: active_zone.length,
      receive: receive.length,
      notInvoled: notInvoled.length,
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
      etc: etc.length,
    });

    setZoneStat({
      zone_1: zone_1.length,
      zone_2: zone_2.length,
      zone_3: zone_3.length,
      zone_4: zone_4.length,
    });
  }, [fetchData]);

  const signout = () => {
    signOut(auth);
  };

  const Card = ({ label, value }) => {
    return (
      <>
        <Col
          span={7}
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
      <Sidebar signOut={signout} role={role} />
      <div className="pt-4 px-12">
        <Row>
          <Col span={16}>
            <Row className="">
              <Card
                label={'จำนวนเรื่องทั้งหมด'}
                value={fetchData && fetchData.length}
              />
            </Row>
            <Row className="mt-1 space-x-1">
              <Card
                label={'รอลงเขตรับผิดชอบ'}
                value={stat?.wait && stat.wait}
              />
              <Card
                label={'รอการตรวจสอบ'}
                value={stat?.active_zone && stat.active_zone}
              />
              <Card label={'รับเรื่อง'} value={stat?.receive && stat.receive} />
            </Row>
            <Row className="mt-1 space-x-1">
              <Card
                label={'ดำเนินการเสร็จสิ้น'}
                value={stat?.complete && stat.complete}
              />
              <Card
                label={'ไม่เกี่ยวข้อง'}
                value={stat?.notInvoled && stat.notInvoled}
              />
            </Row>
          </Col>
          <Col span={8}>
            <StatChart data={stat} />
          </Col>
        </Row>
      </div>
      <Row className="mt-4 ">
        <Col span={24} className="bg-blue-500 p-4">
          <span className="text-xl text-white">ประเภทของปัญหา</span>
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <Row className="mt-1 px-12">
            <Card label={'ไฟฟ้า'} value={kindStat?.elec && kindStat.elec} />
            <Card label={'ประปา'} value={kindStat?.water && kindStat.water} />
            <Card label={'ถนน'} value={kindStat?.street && kindStat.street} />
          </Row>
          <Row className="mt-1 px-12">
            <Card label={'ต้นไม้'} value={kindStat?.tree && kindStat.tree} />
            <Card
              label={'ความสะอาด'}
              value={kindStat?.clean && kindStat.clean}
            />
            <Card
              label={'ทางเท้า'}
              value={kindStat?.footpath && kindStat.footpath}
            />
          </Row>
          <Row className="mt-1 px-12">
            <Card
              label={'จราจร จอดรถ'}
              value={kindStat?.traffic && kindStat.traffic}
            />
            <Card label={'กลิ่น'} value={kindStat?.smell && kindStat.smell} />
            <Card label={'เสียง'} value={kindStat?.sound && kindStat.sound} />
            <Card label={'อื่นๆ'} value={kindStat?.sound && kindStat.etc} />
          </Row>
        </Col>
        <Col span={8}>
          <StatKindChart data={kindStat} />
        </Col>
      </Row>

      {role == 1 ? (
        <>
          <Row className="mt-4 ">
            <Col span={24} className="bg-blue-500 p-4">
              <span className="text-xl text-white">พื้นที่รับผิดชอบ</span>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Row className="mt-1 mb-5  px-12">
                <Card
                  label={'ศรีวิชัย'}
                  value={zoneStat?.zone_1 && zoneStat.zone_1}
                />
                <Card
                  label={'นครพิงค์'}
                  value={zoneStat?.zone_2 && zoneStat.zone_2}
                />
                <Card
                  label={'เม็งราย'}
                  value={zoneStat?.zone_3 && zoneStat.zone_3}
                />
                <Card
                  label={'กาวิละ'}
                  value={zoneStat?.zone_4 && zoneStat.zone_4}
                />
              </Row>
            </Col>
            <Col span={8}>
              <StatZoneChart data={zoneStat} />
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Dashboard;
