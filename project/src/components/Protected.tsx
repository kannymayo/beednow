import { Navigate, useLocation, Outlet } from 'react-router-dom'

import { toast } from 'react-toastify'
import { useAuthContext } from '../store/AuthContext'

export default function Protected() {
  const { user } = useAuthContext()
  let location = useLocation()

  if (!user?.uid) {
    toast('You must be logged in to view this page.', { type: 'info' })
    return (
      <Navigate to="/login" state={{ loginRedir: location.pathname }} replace />
    )
  }

  return <Outlet />
}
