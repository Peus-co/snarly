import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BorderBeam } from "./border-beam"
import { supabase } from "../../lib/supabase"

export function Borderdemo({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [emailError, setEmailError] = useState("")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/i
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setEmailError("")
    setPasswordError("")
    setError("")
    setSuccessMessage("")
    
    if (!email) {
      setEmailError("Email is required")
      return
    }
    
    if (!validateEmail(email)) {
      setEmailError("Email must end with @gmail.com")
      return
    }
    
    if (!password) {
      setPasswordError("Password is required")
      return
    }
    
    const passwordValidation = validatePassword(password)
    if (passwordValidation) {
      setPasswordError(passwordValidation)
      return
    }
    
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError

        if (data?.session) {
          localStorage.setItem("token", data.session.access_token)
          if (onLoginSuccess) onLoginSuccess(data.user)
          navigate("/chat")
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })

        if (signUpError) throw signUpError

        if (data?.session) {
          localStorage.setItem("token", data.session.access_token)
          if (onLoginSuccess) onLoginSuccess(data.user)
          navigate("/chat")
        } else if (data?.user) {
          setSuccessMessage("Account created! Please check your email or proceed to login.")
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-[350px] overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h3>
        <p className="text-sm text-white/60">
          {isLogin ? "Enter your credentials to access your account." : "Create an account to get started."}
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-2 text-sm text-red-400 bg-red-900/20 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-2 text-sm text-green-400 bg-green-900/20 rounded">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid w-full items-center gap-4">
        {!isLogin && (
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="name" className="text-sm text-white/80">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30"
              required
            />
          </div>
        )}
        
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="email" className="text-sm text-white/80">Email (@gmail.com)</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@gmail.com"
            className={`h-10 rounded-lg border px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30 ${emailError ? 'border-red-500' : 'border-white/10 bg-white/5'}`}
            required
          />
          {emailError && <p className="text-xs text-red-400">{emailError}</p>}
        </div>
        
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="password" className="text-sm text-white/80">Password (min 8 digits)</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={`h-10 rounded-lg border px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30 ${passwordError ? 'border-red-500' : 'border-white/10 bg-white/5'}`}
            required
          />
          {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
              setSuccessMessage("")
              setEmailError("")
              setPasswordError("")
            }}
            className="text-xs text-white/70 hover:text-white underline"
          >
            {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/25 disabled:opacity-50"
          >
            {loading ? "Please wait..." : (isLogin ? "Login" : "Sign Up")}
          </button>
        </div>
      </form>
      
      <BorderBeam duration={8} size={100} />
    </div>
  )
}
