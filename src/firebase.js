import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyA5gzDnmVlLo6g3yRs0oHZNgxQsYQMI2w4",
  authDomain: "dazzlone-d7b14.firebaseapp.com",
  projectId: "dazzlone-d7b14",
  storageBucket: "dazzlone-d7b14.appspot.com",
  messagingSenderId: "971757089584",
  appId: "1:971757089584:web:470a76d7f0ed823067cef5",
  measurementId: "G-S74BL1BTVK"
  };


export const Firebase = firebase.initializeApp(firebaseConfig);
const db = Firebase.firestore();
const auth = firebase.auth();
const firebasestorage = Firebase.storage();

export {firebasestorage};
export { auth };
export default db;
