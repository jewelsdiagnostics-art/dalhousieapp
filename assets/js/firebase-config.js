/* ============================================
   firebase-config.js - Firebase bootstrap
   ============================================ */

(function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyA1Y8YOPsBiEbXxo26JTyqZfFbPTSuItyA",
    authDomain: "dalhousie-cc176.firebaseapp.com",
    projectId: "dalhousie-cc176",
    storageBucket: "dalhousie-cc176.firebasestorage.app",
    messagingSenderId: "490226045206",
    appId: "1:490226045206:web:eb797672573ebc3babc037",
    measurementId: "G-EN8K43HRVM"
  };

  window.FirebaseConfig = firebaseConfig;

  if (!window.firebase) {
    console.warn('Firebase SDK not loaded yet.');
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window.FirebaseApp = firebase.app();
  window.FirebaseAuth = firebase.auth();
  window.FirebaseDb = firebase.firestore();
})();
