import Link from "next/link";
function Sidebar({ signOut }) {
  return (
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
  );
}

export default Sidebar;
