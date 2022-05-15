import React from 'react';
import Nevbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { onValue, ref, remove, update, set } from 'firebase/database';
import { db } from '../../plugins/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';
import axios from 'axios';
import { getApp } from 'firebase/app';
import SaveModal from '../../components/Modal/SaveModal';
import DeleteModal from '../../components/Modal/DeleteModal';
import CreateModal from '../../components/Modal/createModal';
import UpdateModal from '../../components/Modal/UpdateModal';
import CreateZone from '../../components/Modal/CreateZoneModal';
import CreateZoneModal from '../../components/Modal/CreateZoneModal';
import DeleteZoneModel from '../../components/Modal/DeleteZoneModel';
import UpdateZoneModal from '../../components/Modal/UpdateZoneModal';

function index({ role, setRole, district, setDistrict }) {
  const route = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [alluser, setAlluser] = useState();
  const [allzone, setAllzone] = useState([]);
  const [edit, setEdit] = useState({});
  const [modalSave, setModalSave] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_FUNCTION;
  const [delModal, setDelModal] = useState(<></>);
  const [hiddenAccount, setHiddenAccount] = useState(false);
  const [hiddenZone, setHiddenZone] = useState(false);
  const [modalCreateUser, setModalCreateUser] = useState(<></>);
  const [updateModal, setUpdateModal] = useState(<></>);
  const [createZoneModal, setCreateZoneModal] = useState(<></>);
  const [delZoneModal, setDelZoneModal] = useState(<></>);
  const [updateZoneModal, setUpdateZoneModal] = useState(<></>);

  const signout = () => {
    signOut(auth);
    route.push('/index');
  };

  useEffect(() => {
    if (role != 1) {
      route.push('/index');
    }
  }, [role]);

  useEffect(() => {
    if (user === null) {
      route.push('/index');
    } else {
      onValue(ref(db, `/permission/${user.uid}`), snapshot => {
        const res = snapshot.val();
        setRole(res.role);
        setDistrict(res.district);
      });
      onValue(ref(db, '/permission'), snapshot => {
        const res = snapshot.val();
        const arr = [];
        for (const key in res) {
          arr.push({ ...res[key], id: key });
        }
        setAlluser(arr.filter(item => item.id != user.uid));
      });
      onValue(ref(db, '/district'), snapshot => {
        const res = snapshot.val();
        setAllzone(res);
      });
    }
  }, [user]);

  const zoneChange = (e, index) => {
    const value = e.target.value;
    setEdit(prev => ({
      ...prev,
      [index]: value,
    }));
  };

  const saveUser = index => {
    const user = alluser[index];
    const zoneUpdate = edit[index] || null;
    const refUser = ref(db, `/permission/${user.id}`);
    if (zoneUpdate == null) return;
    update(refUser, { district: zoneUpdate });
    setModalSave(false);
    setTimeout(() => {
      setModalSave(true);
    }, 2000);
  };

  const deleteUsers = index => {
    const user = alluser[index];
    const refUser = ref(db, `/permission/${user.id}`);
    setDelModal(
      <DeleteModal
        email={user.email}
        user={user}
        remove={remove}
        refUser={refUser}
        setDelModal={setDelModal}
      />,
    );
  };

  const updateUser = index => {
    const user = alluser[index];
    setUpdateModal(<UpdateModal user={user} setUpdateModal={setUpdateModal} />);
  };

  const createZone = () => {
    const newIndex = allzone.length;
    const refzone = ref(db, `/district/${newIndex}`);
    setCreateZoneModal(
      <CreateZoneModal
        set={set}
        refzone={refzone}
        setCreateZoneModal={setCreateZoneModal}
      />,
    );
    console.log(newIndex);
  };

  const deleteZone = index => {
    const refzone = ref(db, `/district/${index}`);
    const zone = allzone[index];
    setDelZoneModal(
      <DeleteZoneModel
        zone={zone}
        refzone={refzone}
        remove={remove}
        index={index}
        setDelZoneModal={setDelZoneModal}
      />,
    );
  };

  const updateZone = index => {
    const refzone = ref(db, `/district`);
    const zone = allzone[index];
    setUpdateZoneModal(
      <UpdateZoneModal
        zone={zone}
        update={update}
        index={index}
        refzone={refzone}
        setUpdateZoneModal={setUpdateZoneModal}
      />,
    );
  };

  return (
    <>
      <SaveModal hidden={modalSave} />
      {delModal}
      {modalCreateUser}
      {updateModal}
      {createZoneModal}
      {delZoneModal}
      {updateZoneModal}
      <Nevbar signout={signout} role={role} district={district} />

      <div className="pt-4 px-12">
        <Row className="">
          <Col span={24} className="bg-blue-500 p-5 rounded-t-md">
            <Row>
              <Col span={23}>
                <span className="text-2xl p-5 text-white">ตั้งค่าบัญชี</span>
              </Col>
              <Col span={1}>
                <button
                  className="text-white "
                  onClick={() => setHiddenAccount(!hiddenAccount)}
                >
                  {hiddenAccount ? <>เปิด</> : <>ปิด</>}
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="bg-gray-300" hidden={hiddenAccount}>
          <Col className="px-5 mt-2 ml-auto">
            <button
              className="p-3 px-6 bg-blue-500 rounded-lg text-white hover:opacity-70"
              onClick={() =>
                setModalCreateUser(
                  <CreateModal
                    setModalCreateUser={setModalCreateUser}
                    allzone={allzone}
                  />,
                )
              }
            >
              เพิ่ม
            </button>
          </Col>
          <Col span={24} className="p-5">
            {alluser && (
              <table className="table w-full border bg-white">
                <thead>
                  <tr className="border">
                    <th className="w-4 p-2 text-center">อันดับ</th>
                    <th className="w-32 p-5 text-center">Email</th>
                    <th className="w-24 p-2">พื้นที่รับผิดชอบ</th>
                    {/* <th className="w-16 p-2">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {alluser.map((user, index) => (
                    <tr key={user.id} className="border-b border-dashed">
                      <td className="w-4 p-2 text-center">{index + 1}</td>
                      <td className="w-32 p-2 text-center">{user.email}</td>
                      <td className="w-16 p-2 text-center">
                        <select
                          name="zone"
                          id={user.id}
                          //   value={item.district}
                          className="border border-blue-500 p-1"
                          onChange={e => zoneChange(e, index)}
                        >
                          <option value="item.district">
                            {allzone[user.district]}
                          </option>
                          {allzone &&
                            allzone.map((item, key) => (
                              <option
                                key={item}
                                value={key}
                                hidden={key == user.district}
                              >
                                {item}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="p-2  w-16 space-x-1  items-center ">
                        <button
                          className="p-1 px-4 bg-yellow-300 rounded-lg text-white"
                          onClick={() => {
                            updateUser(index);
                          }}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="p-1 px-4 bg-green-500 rounded-lg text-white"
                          onClick={() => {
                            saveUser(index);
                          }}
                        >
                          บันทึก
                        </button>
                        <button
                          className="p-1 px-5 bg-red-600  rounded-lg text-white"
                          onClick={() => {
                            deleteUsers(index);
                          }}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col span={24} className="bg-blue-500 p-5 rounded-t-md">
            <Row>
              <Col span={23}>
                <span className="text-2xl p-5 text-white">
                  พื้นที่รับผิดชอบ
                </span>
              </Col>
              <Col span={1}>
                <button
                  className="text-white "
                  onClick={() => setHiddenZone(!hiddenZone)}
                >
                  {hiddenZone ? <>เปิด</> : <>ปิด</>}
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="bg-gray-300 mb-20" hidden={hiddenZone}>
          <Col className="px-5 mt-2 ml-auto">
            <button
              className="p-3 px-6 bg-blue-500 rounded-lg text-white hover:opacity-70"
              onClick={() => createZone()}
            >
              เพิ่ม
            </button>
          </Col>
          <Col span={24} className="p-5">
            <table className="table w-full border bg-white">
              <thead>
                <tr className="border">
                  <th className="w-4 p-2 text-center">อันดับ</th>
                  <th className="w-24 p-2">พื้นที่รับผิดชอบ</th>
                  {/* <th className="w-16 p-2">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {allzone &&
                  allzone.map((item, index) => (
                    <tr className="border-b border-dashed" key={index}>
                      <td className="w-4 p-2 text-center">{index}</td>
                      <td className="w-24 p-2 text-center">{item}</td>
                      <td className="p-2  w-16 space-x-1  items-center ">
                        <button
                          className="p-1 px-4 bg-yellow-300 rounded-lg text-white"
                          onClick={() => {
                            updateZone(index);
                          }}
                        >
                          แก้ไข
                        </button>

                        <button
                          className="p-1 px-5 bg-red-600  rounded-lg text-white"
                          onClick={() => {
                            deleteZone(index);
                          }}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default index;
