import { useEffect, useRef } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

import { toast } from 'react-toastify'
import useUserAtom from '../store/useUserAtom'

export default function Protected() {
  const [user] = useUserAtom()
  const location = useLocation()
  const navigate = useNavigate()

  const pathLastToasted = useRef('')

  useEffect(() => {
    if (!user?.uid) {
      navigate('/login', {
        state: { redirUrl: location.pathname },
        replace: true,
      })
    }
    // fire after navigation actually took place and unmount this
    return () => {
      const toastMsg = `You must be logged in to view ${location.pathname}.`
      if (!user?.uid) {
        if (pathLastToasted.current !== location.pathname) {
          toast(toastMsg, { type: 'warning' })
        } else {
          console.info('Consecutive toasts prevented.')
        }
        pathLastToasted.current = location.pathname
      }
    }
  }, [user, location])

  return <Outlet />
}
