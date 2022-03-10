import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBpr_uGDQFpr_JiCZq0ATPFKFmyD5Rc0Ro",
  authDomain: "chatbot-49334.firebaseapp.com",
  databaseURL: "https://chatbot-49334-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatbot-49334",
  storageBucket: "chatbot-49334.appspot.com",
  messagingSenderId: "386710740850",
  appId: "1:386710740850:web:6ca86e94c14114de8a87eb",
  measurementId: "G-RBBX5X6DJH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

export { db }