import Link from "next/link";
function Sidebar({ signOut }) {
  return (
    <nav class="bg-blue-700">
      <div class="max-w-7xl mr-auto px-2 sm:px-6 rl:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="bg-blue-900 text-white px-6 py-0.5 rounded-md text-sm font-medium">
              <li>
                <Link href={"/"} passHref>
                  <p className="p-1 hover:cursor-pointer">Dashboard</p>
                </Link>
              </li>
            </div>
            <div className="bg-blue-900 text-white px-6 py-0.5 rounded-md text-sm font-medium">
              <li>
                <Link href={"/statTable"} passHref>
                  <p className="p-1 font-prompt hover:cursor-pointer">
                    สถิติ
                  </p>
                </Link>
              </li>
            </div>
            <div className="bg-blue-900 text-white px-6 py-0.5 rounded-md text-sm font-medium">
              <li
                className=""
                onClick={() => {
                  signOut();
                }}
              >
                <Link href={"#"} passHref>
                  <p className="hover:cursor-pointer">Logout</p>
                </Link>
              </li>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
