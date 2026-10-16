import { Borderdemo } from "./ui/border-beam-demo"
import { useState } from "react"

export default function LoginPopup({ isOpen, onClose }) {
  const [user, setUser] = useState(null)

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          ✕
        </button>
        <Borderdemo onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}