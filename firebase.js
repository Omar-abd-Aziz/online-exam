export const firebaseConfig = {
  apiKey: "AIzaSyB0iaRtoR9i8hyGmQmwCUNUpgByDiM2FtE",
  authDomain: "online-exam-e718f.firebaseapp.com",
  projectId: "online-exam-e718f",
  storageBucket: "online-exam-e718f.appspot.com",
  messagingSenderId: "360100096435",
  appId: "1:360100096435:web:eec73aa38a75a6b3a743c6"
};


import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';


let docName = "online-exam";

export {docName,initializeApp,getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt};

