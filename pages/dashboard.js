import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../plugins/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import StatChart from "../components/chart/StatChart";

function Home({}) {
  const [stat, setStat] = useState();
  const route = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;


  useEffect(() => {
    if (user === null) {
      route.push("/index");
    } else {
      onValue(ref(db, "/prediction"), (snapshot) => {
        setStat(snapshot.val());
      });
    }
  }, [user,route]);

  const signout = () => {
    signOut(auth);
  };

  return (
    <div className="flex h-scree">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex h-full">
          <Sidebar signOut={signout} />
          <main className="flex flex-col w-full h-screen bg-white overflow-x-hidden overflow-y-hiden mb-14">
          </main>
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps(ctx) {
//   const auth = await getAuth();
//   const user = await auth.currentUser;
//   console.log("getServerSideProps" + auth);
//   const dbref = await ref(db, "/prediction");
//   let stat = null;
//   onValue(dbref, (snapshot) => {
//     stat = snapshot.val();
//   });

//   return { props: { stat: stat, user: user } };
// }

export default Home;
