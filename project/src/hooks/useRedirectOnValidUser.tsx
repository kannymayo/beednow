import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { UnifiedUser } from './useUnifiedAuth'

export default function useRedirectOnValidUser(_user: UnifiedUser) {
  const navigate = useNavigate()
  const location = useLocation()
  // not last url, but the last set redirUrl state
  const redirUrl = location.state?.redirUrl || '/'

  useEffect(() => {
    if (_user?.uid) {
      const redirMsg = redirUrl === '/' ? '' : `Redirecting to ${redirUrl}`
      navigate(redirUrl)
      if (redirMsg) {
        toast(redirMsg, { type: 'info' })
      }
    }
  }, [_user])

  return redirUrl
}
