import "firebase/firestore";
import firebase from "firebase/app";

const options = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || ""
};

if (firebase.apps && !firebase.apps.length) {
  firebase.initializeApp(options);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export type DocumentReference = firebase.firestore.DocumentReference;
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
export type FieldValue = firebase.firestore.FieldValue;
export type Timestamp = firebase.firestore.Timestamp;
export type User = firebase.User;
export type UserCredential = firebase.auth.UserCredential;

export default firebase;
