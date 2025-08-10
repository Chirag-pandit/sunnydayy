/// <reference types="vite/client" />
import { initializeApp, getApp, getApps } from "firebase/app"
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth"


interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly url: string
}
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function assertEnv() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn(
      `[firebase] Missing env vars: ${missing.join(", ")}. Check your .env.local.`
    )
  }
}
assertEnv()

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
// Prefer local (persist across tabs/sessions)
setPersistence(auth, browserLocalPersistence).catch((e) => {
  // eslint-disable-next-line no-console
  console.error("Failed to set auth persistence:", e)
})

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })