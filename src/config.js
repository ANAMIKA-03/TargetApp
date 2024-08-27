import firebase from "firebase/compact/app";
import "firebase/compact/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCdn7nPeShsEkCvyeoCs85RPU9Ildlvh2Q",
    authDomain: "queezy-792ff.firebaseapp.com",
    projectId: "queezy-792ff",
    storageBucket: "queezy-792ff.appspot.com",
    messagingSenderId: "222650696835",
    appId: "1:222650696835:web:485fbe5a616fc4f61547b6",
    measurementId: "G-E74NB13RXH"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  };

  export { firebase };