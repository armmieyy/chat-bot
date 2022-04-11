import Sidebar, { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../plugins/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";

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
        <Sidebar signOut={signout}/>
        <h1>inkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk</h1>
      </div>
    </div>
  );
}

export default Home;
