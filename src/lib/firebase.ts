import { initializeApp, getApp, getApps } from "firebase/app"
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl3hFBWyTcligLMt2cP42KKYXaTDB3U-o",
  authDomain: "sunnyday-68b9f.firebaseapp.com",
  projectId: "sunnyday-68b9f",
  storageBucket: "sunnyday-68b9f.firebasestorage.app",
  messagingSenderId: "716992494418",
  appId: "1:716992494418:web:04b613b079954b0b0b188b",
  measurementId: "G-KYZW7Y16E1"
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Initialize Analytics (only in browser environment)
let analytics
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.warn('Analytics initialization failed:', error)
  }
}

export const auth = getAuth(app)

// Prefer local (persist across tabs/sessions)
setPersistence(auth, browserLocalPersistence).catch((e) => {
  console.error("Failed to set auth persistence:", e)
})

auth.useDeviceLanguage()

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })

// Export analytics if you need it elsewhere
export { analytics }