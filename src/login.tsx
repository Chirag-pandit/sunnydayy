import { useState, type FormEvent } from "react"
import { auth, googleProvider } from "./lib/firebase"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth"

type Props = {
  onSuccess?: (user: User) => void
  fullScreen?: boolean // If true, renders full-page center layout
}

export default function Login({ onSuccess, fullScreen = true }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  function mapFirebaseError(code?: string) {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password."
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later."
      case "auth/popup-closed-by-user":
        return "Popup was closed before completing sign in."
      case "auth/popup-blocked":
        return "Popup was blocked by browser. Please allow popups for this site."
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again."
      case "auth/operation-not-allowed":
        return "Google sign-in is not enabled. Contact administrator."
      default:
        return `Authentication error: ${code || 'Unknown error'}. Please try again.`
    }
  }

  const handleEmailPassword = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      onSuccess?.(cred.user)
    } catch (e: any) {
      setError(mapFirebaseError(e?.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      // Check if popup is blocked
      const popup = window.open('', '_blank', 'width=400,height=600')
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        setError("Popup blocked by browser. Please allow popups for this site.")
        setLoading(false)
        return
      }
      popup.close()

      const cred = await signInWithPopup(auth, googleProvider)
      onSuccess?.(cred.user)
    } catch (e: any) {
      console.error('Google sign-in error:', e) // Add this for debugging
      setError(mapFirebaseError(e?.code))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setError(null)
    setInfo(null)
    const target = email.trim()
    if (!target) {
      setError("Enter your email above to receive a reset link.")
      return
    }
    try {
      await sendPasswordResetEmail(auth, target)
      setInfo("Password reset email sent. Check your inbox.")
    } catch (e: any) {
      setError(mapFirebaseError(e?.code))
    }
  }

  const Root = fullScreen ? "main" : "div"

  return (
    <Root
      className={
        fullScreen
          ? "min-h-dvh grid place-items-center bg-[radial-gradient(1200px_800px_at_20%_-10%,#1f2937_0%,#0f172a_50%,#0b1220_100%)] px-6 text-slate-100"
          : "text-slate-100"
      }
      aria-busy={loading}
    >
      <section
        className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl backdrop-blur"
        role="form"
        aria-labelledby="login-title"
      >
        <header className="mb-5 text-center">
          <h1 id="login-title" className="text-xl font-semibold tracking-tight">
            Login
          </h1>
          <p className="mt-1 text-sm text-slate-400">Access your account</p>
        </header>

        {error ? (
          <div
            className="mb-3 rounded-lg border border-red-900/60 bg-red-950/60 px-3 py-2 text-sm text-rose-200"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {info ? (
          <div
            className="mb-3 rounded-lg border border-emerald-900/50 bg-emerald-950/50 px-3 py-2 text-sm text-emerald-200"
            role="status"
          >
            {info}
          </div>
        ) : null}

        <form className="grid gap-3" onSubmit={handleEmailPassword}>
          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-slate-100 outline-none ring-0 transition focus:border-slate-600 focus:ring-2 focus:ring-slate-700 placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="password" className="text-sm text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 pr-10 text-slate-100 outline-none ring-0 transition focus:border-slate-600 focus:ring-2 focus:ring-slate-700 placeholder:text-slate-500"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                disabled={loading}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="mt-1 grid gap-2">
            <button
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 px-4 font-medium text-slate-100 shadow-sm transition active:translate-y-px hover:border-slate-600"
              disabled={loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 font-medium text-slate-100 transition active:translate-y-px hover:border-slate-700"
              aria-label="Continue with Google"
              title="Continue with Google"
            >
              <span className="inline-grid h-4 w-4 place-items-center rounded-sm bg-white text-xs font-bold text-black">
                G
              </span>
              Continue with Google
            </button>
          </div>

          <div className="mt-1 flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-sky-400 hover:text-sky-300"
              onClick={handleReset}
              disabled={loading}
            >
              Forgot password?
            </button>
            <span className="text-xs text-slate-400">
              No account? Ask your admin to invite you.
            </span>
          </div>
        </form>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        <p className="text-center text-xs text-slate-400">
          By continuing, you agree to the Terms and acknowledge the Privacy Policy.
        </p>
      </section>
    </Root>
  )
}