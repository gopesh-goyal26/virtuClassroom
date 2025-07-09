import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc, onSnapshot, updateDoc, query, deleteDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAMmSLF9Q41uyBrzXtq2EtD7fdkokMr80U",
    authDomain: "virtual-classroom-01.firebaseapp.com",
    projectId: "virtual-classroom-01",
    storageBucket: "virtual-classroom-01.firebasestorage.app",
    messagingSenderId: "93837451747",
    appId: "1:93837451747:web:bb73a5de97f1beae9140d6",
    measurementId: "G-Y3E13HGPJX"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export {app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,
          db, doc, setDoc, getDoc, getDocs, collection, addDoc, onSnapshot, updateDoc, query, deleteDoc, arrayUnion };