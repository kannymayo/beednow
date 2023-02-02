import { useContext, createContext, useEffect, useState } from 'react'
import { auth } from '../api/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as authSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'

type User = {
  [key: string]: any
  uid?: string
}

const AuthContext = createContext<{
  user: User
  googleSignIn: any
  signOut: any
  createEmailAccount: any
  signInWithEmail: any
}>({
  user: {},
  googleSignIn: {},
  signOut: {},
  createEmailAccount: {},
  signInWithEmail: {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({})

  function googleSignIn() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  async function createEmailAccount(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password)
  }

  async function signInWithEmail(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password)
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
    <AuthContext.Provider
      value={{
        googleSignIn,
        signOut,
        user,
        createEmailAccount,
        signInWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
