import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import "firebase/compat/storage";
import 'firebase/compat/auth';
import 'firebase/compat/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBsH1jyTnwwK2gEWsrWD_TG0bbMEfsYmOM",
  authDomain: "mysocial-app-1f02b.firebaseapp.com",
  projectId: "mysocial-app-1f02b",
  storageBucket: "mysocial-app-1f02b.appspot.com",
  messagingSenderId: "92940523535",
  appId: "1:92940523535:web:26a14ec1e343e82c04eb7a",
  measurementId: "G-2YVG6SQ6YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = firebase.firestore(); // Database em tempo real
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { db, auth, storage, functions };