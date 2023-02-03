// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC0-IOFQBrRRBAKQHGepw18DfOfNp-njGg',
  authDomain: 'beednow-6666.firebaseapp.com',
  projectId: 'beednow-6666',
  storageBucket: 'beednow-6666.appspot.com',
  messagingSenderId: '17111421394',
  appId: '1:17111421394:web:0c905ac19f9ea1b593b80b',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const store = getFirestore(app)
export const auth = getAuth(app)
