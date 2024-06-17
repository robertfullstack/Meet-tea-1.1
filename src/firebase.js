import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyD5o0HrFkMwdQ0GzHLDu_W1oxZirX0KOFo",
    authDomain: "instagram-clone-e8409.firebaseapp.com",
    projectId: "instagram-clone-e8409",
    storageBucket: "instagram-clone-e8409.appspot.com",
    messagingSenderId: "354914778100",
    appId: "1:354914778100:web:89439275d3c7eab4ce57a1"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { db, auth, storage, functions };
