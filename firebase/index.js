import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDTkz0zSKxz-5MK4ICe_xVe4KsLTQysNJw",
    authDomain: "next-todo-245e9.firebaseapp.com",
    projectId: "next-todo-245e9",
    storageBucket: "next-todo-245e9.appspot.com",
    messagingSenderId: "127210068217",
    appId: "1:127210068217:web:1755f81d35d102174eea28",
    measurementId: "G-YRG14FR5GW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };