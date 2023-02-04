import { Outlet } from 'react-router-dom'

import useUserAtom from '../store/useUserAtom'
import { useNavigateWithBackLinkAndToast } from '../hooks/navigateUX'

export default function PublicOnly() {
  const [user] = useUserAtom()

  useNavigateWithBackLinkAndToast(!!user?.uid, '/', [
    'You are already logged in',
    {
      type: 'warning',
    },
  ])

  return <Outlet />
}
