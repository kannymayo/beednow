import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAuthState } from '../hooks/useUnifiedAuth'

export default function Protected() {
  const [user] = useAuthState()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.uid) {
      toast('You are already logged in', { type: 'info' })
      navigate('/')
    }
  }, [])
  return <Outlet />
}
