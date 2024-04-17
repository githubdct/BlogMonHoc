// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "mern-blog-20d37.firebaseapp.com",
	projectId: "mern-blog-20d37",
	storageBucket: "mern-blog-20d37.appspot.com",
	messagingSenderId: "444721639285",
	appId: "1:444721639285:web:0a6b313ee3011f70fa2d3c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
