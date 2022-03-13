import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../plugins/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import StatChart from "../components/chart/StatChart";

function Home({ }) {
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
  }, [user, route]);

  const signout = () => {
    signOut(auth);
  };

  return (
    <div>
      <div>
        <nav class="bg-blue-800">
          <div class="max-w-7xl mr-auto px-2 sm:px-6 rl:px-8">
            <div class="relative flex items-center justify-between h-16">
              <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div class="flex-shrink-0 flex items-center">
                    </div>
                    <div class="hidden sm:block sm:ml-2">
                      <Sidebar signOut={signout} />
                    </div>
                </div>
              </div>
            </div>
        </nav>
      </div>
      <div className="mt-32 flex flex-col">
        <table class="shadow-lg bg-white border-collapse">
          <tr>
            <th class="bg-blue-300 border text-left px-8 py-4">ID LINE</th>
            <th class="bg-blue-300 border text-left px-8 py-4">date</th>
            <th class="bg-blue-300 border text-left px-8 py-4">Country</th>
          </tr>
          <tr>
            <td class="border px-8 py-4">armmieyy</td>
            <td class="border px-8 py-4">11/03/2565</td>
            <td class="border px-8 py-4">Italy</td>
          </tr>
          <tr>
            <td class="border px-8 py-4">jujutsu</td>
            <td class="border px-8 py-4">12/03/2565</td>
            <td class="border px-8 py-4">Spain</td>
          </tr>
          <tr>
            <td class="border px-8 py-4">konami</td>
            <td class="border px-8 py-4">13/03/2565</td>
            <td class="border px-8 py-4">Austria</td>
          </tr>
        </table>
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
