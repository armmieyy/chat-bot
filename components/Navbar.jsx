import Link from 'next/link';

function Navbar({ signOut, role }) {
  return (
    <>
      <nav className="flex items-center flex-wrap bg-blue-800 p-3 ">
        <a className="inline-flex items-center p-2 mr-4 ">
          <div className="text-2xl text-white font-bold uppercase tracking-wide">
            ไลน์แชทบอทสำหรับแจ้งปัญหาในชุมชน
          </div>
        </a>
        <div className="hidden w-full lg:inline-flex lg:flex-grow lg:w-auto">
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
            <Link href="/report">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white ">
                รายละเอียด
              </a>
            </Link>
            {role === 1 ? (
              <Link href="/management">
                <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white ">
                  จัดการข้อมูล
                </a>
              </Link>
            ) : (
              <></>
            )}
            <Link href="/complete">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
                Complete
              </a>
            </Link>
            <Link href="/dashboard">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
                Dashboard
              </a>
            </Link>
            {role == 1 ? (
              <span className="ml-5">
                <Link href={'/setting'} passHref>
                  <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-red-600 hover:text-white">
                    ตั้งค่า
                  </a>
                </Link>
              </span>
            ) : (
              <></>
            )}
            <span className="" onClick={signOut}>
              <Link href={'/index'} passHref>
                <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-lg text-white font-bold items-center justify-center hover:bg-red-600 hover:text-white">
                  LogOut
                </a>
              </Link>
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
