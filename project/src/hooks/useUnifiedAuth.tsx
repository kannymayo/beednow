import { useState, useEffect, useRef } from 'react'
import {
  useAuthState as useAuthStateRaw,
  useCreateUserWithEmailAndPassword as useCreateUserWithEmailAndPasswordRaw,
  useSignInWithEmailAndPassword as useSignInWithEmailAndPasswordRaw,
  useSignInWithGoogle as useSignInWithGoogleRaw,
  useSignOut as useSignOutRaw,
} from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'
import { produce } from 'immer'

import { errorToast } from '../utils/preset-toast'
import { auth } from '../api/firebase'

const iconFallback = 'https://cdn-icons-png.flaticon.com/512/3940/3940403.png'

export interface UnifiedUser {
  displayName?: string
  email?: string
  provider?: string
  uid?: string
  photoURL?: string
  [key: string]: any
}

function useAuthState() {
  const [_user, loading, error] = useAuthStateRaw(auth)
  const [user, setUser] = useState<UnifiedUser>({})

  // decorate user
  useEffect(() => {
    // weird that currying doesn't work here
    setUser((prev) =>
      produce(prev, (draft) => {
        draft.photoURL = _user?.photoURL || iconFallback
        draft.displayName = _user?.displayName || _user?.email || 'Anonymous'
        draft.provider = _user?.providerId
        draft.uid = _user?.uid
      })
    )
  }, [_user])

  return [user, loading, error] as const
}

function useCreateUserWithEmailAndPassword() {
  const [create, user, loading, error] =
    useCreateUserWithEmailAndPasswordRaw(auth)

  useEffect(() => {
    if (error) {
      errorToast('Registration', error as Error, 'code')
    }
    if (user?.user) {
      toast(`Account created for ${user?.user.email}.`, {
        type: 'success',
      })
    }
  }, [user, error])

  return [create, loading, error] as const
}

function useSignInWithEmailAndPassword() {
  const [signIn, user, loading, error] = useSignInWithEmailAndPasswordRaw(auth)

  useEffect(() => {
    if (error) {
      errorToast('Login', error as Error, 'code')
    }
    if (user?.user) {
      toast(`Logged in as ${user?.user.email}.`, {
        type: 'success',
      })
    }
  }, [user, error])

  return [signIn, loading, error] as const
}

function useSignInWithGoogle() {
  const [signIn, user, loading, error] = useSignInWithGoogleRaw(auth)

  useEffect(() => {
    if (error) {
      errorToast('Login', error as Error, 'code')
    }
    if (user?.user) {
      toast(`Logged in as ${user?.user.displayName}.`, {
        type: 'success',
      })
    }
  }, [user, error])

  return [signIn, loading, error] as const
}

function useSignOut() {
  const [signOut, loading, error] = useSignOutRaw(auth)
  const prevLoading = useRef(loading)

  useEffect(() => {
    if (error) {
      errorToast('Logout', error as Error, 'code')
    }
  }, [error])

  useEffect(() => {
    if (prevLoading.current && !loading) {
      toast('Logged out', {
        type: 'success',
      })
    }
    prevLoading.current = loading
  }, [loading])

  return [signOut, loading, error] as const
}

export {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
  useSignOut,
}
