import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDSKCku9q3Xl7o1T7aSR7HjrlMntxYjS_M",
  authDomain: "parcial-iii-d283b.firebaseapp.com",
  projectId: "parcial-iii-d283b",
  storageBucket: "parcial-iii-d283b.appspot.com", 
  messagingSenderId: "930691277287",
  appId: "1:930691277287:web:6d2c4fad0cb04f28a3dd42"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app); 
export const auth = getAuth(app); 
