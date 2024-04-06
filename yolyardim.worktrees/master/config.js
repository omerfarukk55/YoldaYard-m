// firebase config key setup

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//your web app's firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAU6WgrV0pW9FpywDsGlQpR1oQlMcz7ahk",
    authDomain: "yolyardim-8eb9b.firebaseapp.com",
    projectId: "yolyardim-8eb9b",
    storageBucket: "yolyardim-8eb9b.appspot.com",
    messagingSenderId: "282479975719",
    appId: "1:282479975719:web:043918c07c4fe3c49f9d02",
    measurementId: "G-BPS8EVW3MV"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
  
  export {firebase};