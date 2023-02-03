import { useEffect, useRef } from 'react'
import {
  useCreateUserWithEmailAndPassword as useCreateUserWithEmailAndPasswordRaw,
  useSignInWithEmailAndPassword as useSignInWithEmailAndPasswordRaw,
  useSignInWithGoogle as useSignInWithGoogleRaw,
  useSignOut as useSignOutRaw,
} from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'

import { errorToast } from '../utils/preset-toast'
import { auth } from '../api/firebase'

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
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
  useSignOut,
}
