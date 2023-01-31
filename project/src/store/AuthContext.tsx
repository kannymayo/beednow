import { useContext, createContext, useEffect, useState } from 'react'
import { auth } from '../api/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as authSignOut,
  onAuthStateChanged,
} from 'firebase/auth'

const AuthContext = createContext<{
  user: { [key: string]: any | null }
  googleSignIn: any
  signOut: any
}>({ user: {}, googleSignIn: {}, signOut: {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({})

  function googleSignIn() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  function signOut() {
    authSignOut(auth)
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser({})
      }
    })
    return () => unsub()
  }, [])

  return (
    <AuthContext.Provider value={{ googleSignIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
