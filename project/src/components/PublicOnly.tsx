import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAuthContext } from '../store/AuthContext'

export default function Protected() {
  const { user } = useAuthContext()

  if (user?.uid) {
    toast('You are already logged in', { type: 'info' })
    return <Navigate to="/" />
  }
  // bug: would transiently render this component before user is set
  return <Outlet />
}
