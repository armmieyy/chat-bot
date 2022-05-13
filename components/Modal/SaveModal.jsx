import React from 'react';

function SaveModal({hidden}) {
  return (
    <div
      hidden={hidden}
      className=" overflow-y-auto overflow-x-hidden fixed w-1/2 z-50 left-1/3 top-1/3 h-modal md:h-full"
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white border rounded-lg shadow dark:bg-gray-700">
          <div className="p-16  text-center">
            <h3 className="mb-5 font-normal text-green-500 text-4xl">
              บันทึกสำเร็จ
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaveModal;
