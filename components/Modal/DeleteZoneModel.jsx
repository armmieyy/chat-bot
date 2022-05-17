import React from 'react';

function DeleteZoneModel({ zone, refzone, setDelZoneModal, remove }) {
  return (
    <div className=" overflow-y-auto overflow-x-hidden fixed w-1/2 z-50 left-1/3 top-1/3 h-modal md:h-full">
      <div className="relative p-4 w-full max-w-md h-full">
        <div className="relative bg-white border rounded-lg shadow ">
          <div className="p-16  text-center">
            <span className="mb-5 font-normal text-yellow-500 text-2xl">
              คุณต้องการลบ
            </span>
            <br />
            <span className="mb-5 font-normal text-yellow-500 text-2xl">
              {zone}
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
                remove(refzone);
                setDelZoneModal(<></>);
              }}
            >
              ลบ
            </button>
            <button
              className="bg-gray-300  w-1/2 rounded-lg p-1 hover:opacity-70"
              onClick={() => setDelZoneModal(<></>)}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteZoneModel;
