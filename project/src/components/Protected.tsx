import { Outlet } from 'react-router-dom'

import useUserAtom from '../store/useUserAtom'
import { useNavigateWithBackLinkAndToast } from '../hooks/navigateUX'

export default function Protected() {
  const [user] = useUserAtom()

  useNavigateWithBackLinkAndToast(!user?.uid, '/login')

  return <Outlet />
}
