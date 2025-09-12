// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

// Firebase konfiqurasiya
const firebaseConfig = {
  apiKey: "AIzaSyAqF9YTxSkeNczZ28xON4CzgNQZSldTEB4",
  authDomain: "enerjix-9ad27.firebaseapp.com",
  projectId: "enerjix-9ad27",
  storageBucket: "enerjix-9ad27.appspot.com",
  messagingSenderId: "785833763404",
  appId: "1:785833763404:web:91ffdb29c40937f9110ae9"
};

// Firebase başlat
export const app = initializeApp(firebaseConfig);
