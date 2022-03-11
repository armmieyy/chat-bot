import Link from "next/link";
function Sidebar({ signOut }) {
  return (
    <div className=" w-72 h-full bg-yellow-400">
      <div className="w-full flex mx-auto py-5">
        <div className="w-full h-full flex  justify-end text-gray-700 text-xl font-prompt">
          <div className=" w-11/12">
            <div className="bg-white rounded-l-md pt-2 pb-2 ">
              <ul className="space-y-3">
                <li
                  className=""
                  onClick={() => {
                    signOut();
                  }}
                >
                  <Link href={"#"} passHref>
                    <p className="p-1 hover:cursor-pointer">ออกจากระบบ</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
