// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyD6E0EF0j1BqZZr1Iv9HsKpBBqQHyd5g3s",
    authDomain: "clone-2-ac924.firebaseapp.com",
    projectId: "clone-2-ac924",
    storageBucket: "clone-2-ac924.appspot.com",
    messagingSenderId: "409252985962",
    appId: "1:409252985962:web:bd7c0f8176e70ff29f1e13",
    measurementId: "G-EF94QS2RXD"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db= firebaseApp.firestore();
  const auth= firebase.auth();

  export {db,auth};