import React from 'react';
import axios from 'axios';
function DeleteModal({
  email,
  setConfirmDel,
  setDelModal,
  user,
  remove,
  refUser,
}) {
  const API = process.env.NEXT_PUBLIC_API_FUNCTION;
  return (
    <div
      //   hidden={hidden}
      className=" overflow-y-auto overflow-x-hidden fixed w-1/2 z-50 left-1/3 top-1/3 h-modal md:h-full"
    >
      <div className="relative p-4 w-full max-w-md h-full">
        <div className="relative bg-white border rounded-lg shadow ">
          <div className="p-16  text-center">
            <span className="mb-5 font-normal text-yellow-500 text-2xl">
              คุณต้องการลบบัญชี
            </span>
            <br />
            <span className="mb-5 font-normal text-yellow-500 text-2xl">
              {email}
            </span>
            <br />
            <span className="mb-5 font-normal text-yellow-500 text-2xl">
              ใช่หรือไม่
            </span>
          </div>
          <div className="flex m-1 space-x-1">
            <button
              className="bg-red-500 text-white w-1/2 rounded-lg p-1 hover:opacity-70"
              onClick={() => {
                console.log(user);
                axios.post(API + 'chatbot-49334/us-central1/deleteUserById', {
                  uid: user.id,
                });
                remove(refUser);
                setDelModal(<></>);
              }}
            >
              ลบ
            </button>
            <button
              className="bg-gray-300  w-1/2 rounded-lg p-1 hover:opacity-70"
              onClick={() => setDelModal(<></>)}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
