// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6q_X0TFBeTp-INwmYKzwWWW8vt8oaX7g",
    authDomain: "digital-guestbook-e8d2f.firebaseapp.com",
    projectId: "digital-guestbook-e8d2f",
    storageBucket: "digital-guestbook-e8d2f.appspot.com",
    messagingSenderId: "160072611797",
    appId: "1:160072611797:web:4a2b2099cb1746a4872f5c"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;