import axios from 'axios';
import React, { useState } from 'react';

function CreateModal({ allzone, setModalCreateUser }) {
  const [user, setUser] = useState({
    email: '',
    password: '',
    confirm_password: '',
    zone: '',
  });
  const [errmsg, setErrmsg] = useState();
  const API = process.env.NEXT_PUBLIC_API_FUNCTION;

  const handleSubmit = () => {
    if (user.password != user.confirm_password) {
      setErrmsg('Password ไม่ตรงกัน');
      return;
    } else {
      axios
        .post(API + 'chatbot-49334/us-central1/createUser', user)
        .then(res => {
          if (res.data == 'ok') setModalCreateUser(<></>);
          if (res.data == 'auth/email-already-exists')
            setErrmsg('Email นี้ถูกใช้แล้ว ');
          if (res.data == 'auth/invalid-password')
            setErrmsg('กรุณาตั้งความยาว Password จำนวน 6 ตัวอักษรขึ้นไป');
        });
    }
  };
  return (
    <div className=" overflow-y-auto overflow-x-hidden fixed w-1/2 z-50 left-1/3 top-1/3 h-modal md:h-full">
      <div className="relative p-4 w-full max-w-md h-full">
        <div className="relative bg-white border rounded-lg shadow ">
          <form
            onSubmit={e => {
              handleSubmit();
              e.preventDefault();
            }}
          >
            <div className="p-4 text-center">
              <span className="mb-5 font-normal text-2xl ">สร้างบัญชี</span>
              <br />
              <span className="text-red-500">{errmsg && errmsg}</span>
              <div className="flex mt-3 pl-6">
                <label htmlFor="" className="mr-3 text-left w-1/3">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="p-1 border rounded w-1/2 "
                  value={user.email}
                  onChange={e => {
                    const email = e.target.value;
                    setUser(prev => ({ ...prev, email: email }));
                  }}
                  required
                />
              </div>
              <div className="flex pl-6 mt-1">
                <label htmlFor="" className="w-1/3 mr-3 text-left">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="p-1 border rounded w-1/2"
                  value={user.password}
                  onChange={e => {
                    const password = e.target.value;
                    setUser(prev => ({ ...prev, password: password }));
                  }}
                  required
                />
              </div>
              <div className="flex pl-6 mt-1">
                <label htmlFor="" className="w-1/3 mr-3 text-left">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  className="p-1 border rounded w-1/2"
                  value={user.confirm_password}
                  onChange={e => {
                    const confirm_password = e.target.value;
                    setUser(prev => ({
                      ...prev,
                      confirm_password: confirm_password,
                    }));
                  }}
                  required
                />
              </div>
              <div className="flex pl-6 mt-1">
                <label htmlFor="" className="w-1/3 mr-3 text-left">
                  พื้นที่รับผิดชอบ
                </label>
                <select
                  name="zone"
                  id="zone"
                  className="p-1 border rounded w-1/2"
                  onChange={e => {
                    const zone = e.target.value;
                    setUser(prev => ({ ...prev, zone: zone }));
                  }}
                  required
                >
                  <option key={0} value={null}></option>
                  {allzone &&
                    allzone.map((item, index) => (
                      <option key={index} value={index}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex m-1 space-x-1">
              <button
                className="bg-green-500 text-white w-1/2 rounded-lg p-1 hover:opacity-70"
                type="submit"
              >
                สร้าง
              </button>
              <button
                className="bg-gray-300  w-1/2 rounded-lg p-1 hover:opacity-70"
                onClick={() => setModalCreateUser(<></>)}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateModal;
