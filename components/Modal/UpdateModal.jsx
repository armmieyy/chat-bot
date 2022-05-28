import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UpdateModal({ user, setUpdateModal }) {
  const [selectUser, setSelectUser] = useState(user);
  const [errmsg, setErrmsg] = useState('');
  const API = process.env.NEXT_PUBLIC_API_FUNCTION;

  const handleSubmit = () => {
    if (selectUser.password != selectUser.confirm_password) {
      setErrmsg('Password ไม่ตรงกัน');
      return;
    }
    setErrmsg('');

    axios
      .post(process.env.NEXT_PUBLIC_API_FUNCTION + '/updateUserById', selectUser)
      .then(res => {
        if (res.data == 'ok') {
          setUpdateModal(<></>);
        }
        if (res.data == 'auth/email-already-exists')
          setErrmsg('Email นี้ถูกใช้แล้ว ');
        if (res.data == 'auth/invalid-password')
          setErrmsg('กรุณาตั้งความยาว Password จำนวน 6 ตัวอักษรขึ้นไป');
      });
  };

  useEffect(() => {}, [selectUser]);
  return (
    <div className=" overflow-y-auto overflow-x-hidden fixed w-1/2 z-50 left-1/3 top-1/3 h-modal md:h-full">
      <div className="relative p-4 w-full max-w-md h-full">
        <div className="relative bg-white border rounded-lg shadow ">
          <form
            onSubmit={e => {
              e.preventDefault();

              handleSubmit();
            }}
          >
            <div className="p-4 text-center">
              <span className="mb-5 font-normal text-2xl ">แก้ไขบัญชี</span>
              <br />
              <span className="text-red-500">{errmsg && errmsg}</span>
              <div className="flex pl-6 mt-1">
                <label htmlFor="" className="w-1/3 mr-3 text-left">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="p-1 border rounded w-1/2"
                  value={selectUser.email}
                  disabled
                  onChange={e => {
                    const email = e.target.value;
                    setSelectUser(prev => ({ ...prev, email: email }));
                  }}
                  required
                />
              </div>

              <div className="flex pl-6 mt-1">
                <label htmlFor="" className="w-1/3 mr-3 text-left">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="p-1 border rounded w-1/2"
                  value={selectUser.password}
                  onChange={e => {
                    const password = e.target.value;
                    setSelectUser(prev => ({ ...prev, password: password }));
                  }}
                  required
                />
              </div>
              <div className="flex pl-6 mt-1">
                <label htmlFor="" className="w-1/3 mr-3 text-left">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  className="p-1 border rounded w-1/2"
                  value={selectUser.confirm_password}
                  onChange={e => {
                    const confirm_password = e.target.value;
                    setSelectUser(prev => ({
                      ...prev,
                      confirm_password: confirm_password,
                    }));
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex m-1 space-x-1">
              <button
                className="bg-green-500 text-white w-1/2 rounded-lg p-1 hover:opacity-70"
                type="submit"
              >
                บันทึก
              </button>
              <button
                className="bg-gray-300  w-1/2 rounded-lg p-1 hover:opacity-70"
                onClick={() => setUpdateModal(<></>)}
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

export default UpdateModal;
