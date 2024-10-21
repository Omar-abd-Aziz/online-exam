export const firebaseConfig = {
  apiKey: "AIzaSyB0iaRtoR9i8hyGmQmwCUNUpgByDiM2FtE",
  authDomain: "online-exam-e718f.firebaseapp.com",
  projectId: "online-exam-e718f",
  storageBucket: "online-exam-e718f.appspot.com",
  messagingSenderId: "360100096435",
  appId: "1:360100096435:web:eec73aa38a75a6b3a743c6"
};


import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getAuth,onAuthStateChanged, sendPasswordResetEmail ,sendEmailVerification,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';
import { getFirestore,getDocsFromServer,getAggregateFromServer,sum,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, addDoc, updateDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt, writeBatch  } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';



let docName = "online-exam";

export {docName,getDocsFromServer, getAggregateFromServer,sum,onAuthStateChanged,sendEmailVerification, sendPasswordResetEmail , getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut ,initializeApp,getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, updateDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt, writeBatch};



/// host on githup


// firebase omarvenom22@gmail.com

