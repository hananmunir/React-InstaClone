import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyB7ziZGa6RpJztDyQLK3Ii-dqjpy5JpJjM",
  authDomain: "instagram-clone-9b859.firebaseapp.com",
  projectId: "instagram-clone-9b859",
  storageBucket: "instagram-clone-9b859.appspot.com",
  messagingSenderId: "151630853833",
  appId: "1:151630853833:web:22009aa4212606ca7f3f18"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const provider = new firebase.auth.GoogleAuthProvider();
export {db, auth, storage, provider,firebaseApp}