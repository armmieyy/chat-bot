import React, { useState } from 'react';

function UpdateZoneModal({ zone, setUpdateZoneModal, update, refzone, index }) {
  const [selectZone, setSelectZone] = useState(zone);
  const errmsg = '';
  const handleSubmit = () => {
    update(refzone, { [index]: selectZone });
    setUpdateZoneModal(<></>);
  };
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
              <span className="mb-5 font-normal text-2xl ">
                สร้างพื้นที่รับผิดชอบ
              </span>
              <br />
              <span className="text-red-500">{errmsg && errmsg}</span>
              <div className="flex mt-3 pl-6">
                <label htmlFor="" className="mr-3 text-left w-1/6">
                  แขวง
                </label>
                <input
                  type="text"
                  name="zone"
                  className="p-1 border rounded w-1/2 "
                  value={selectZone}
                  onChange={e => {
                    setSelectZone(e.target.value);
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
                สร้าง
              </button>
              <button
                className="bg-gray-300  w-1/2 rounded-lg p-1 hover:opacity-70"
                onClick={() => setUpdateZoneModal(<></>)}
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

export default UpdateZoneModal;
