import React, { useState, useEffect } from "react"; 
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore"; 
import NovaSaludInicio from "../components/NovaSaludInicio";

const Inicio = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        setIsLoggedIn(true); // Usuario logueado
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.error("No se encontró información del usuario");
        }
      } else {
        setIsLoggedIn(false); // Usuario no logueado
      }
    };

    fetchUserData();
  }, []);

  return (
<NovaSaludInicio></NovaSaludInicio>
  );
};

export default Inicio;
