import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'

import useUserAtom from '../store/useUserAtom'

export default function Protected() {
  const [user] = useUserAtom()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.uid) {
      toast('You are already logged in', { type: 'info' })
      navigate('/')
    }
  }, [])
  return <Outlet />
}
