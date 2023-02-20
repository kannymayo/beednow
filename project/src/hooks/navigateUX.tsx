import { useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { toast as toastForTyping } from 'react-toastify'

import { debouncedToast } from '@/utils/debouncedToast'
import { useUserAtomValue, UnifiedUser } from '@/store/useUserAtom'

function useRedirectOnValidUser(_user: UnifiedUser) {
  const navigate = useNavigate()
  const location = useLocation()
  // not last url, but the last-set redirUrl state
  // so going back and forth between login and register won't overwrite it
  const redirUrl = location.state?.redirUrl || '/'

  useEffect(() => {
    if (_user?.uid) {
      const redirMsg = redirUrl === '/' ? '' : `Redirecting to ${redirUrl}`
      navigate(redirUrl)
    }
  }, [_user])

  return [redirUrl]
}

function useNavigateWithBackLinkAndToast(
  toastArgs?: Parameters<typeof toastForTyping>
) {
  const [user, isLoggedIn] = useUserAtomValue()
  const location = useLocation()
  let shouldIntercept = false
  let interceptedComponent = null

  if (!isLoggedIn) {
    shouldIntercept = true
    interceptedComponent = (
      <Navigate to="/" state={{ redirUrl: location.pathname }} replace={true} />
    )
    if (toastArgs) debouncedToast(...toastArgs)
  }

  return [shouldIntercept, interceptedComponent] as const
}

export { useRedirectOnValidUser, useNavigateWithBackLinkAndToast }
