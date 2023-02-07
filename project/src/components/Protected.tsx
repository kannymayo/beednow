import { Outlet } from 'react-router-dom'

import useUserAtom from '@/store/useUserAtom'
import { useNavigateWithBackLinkAndToast } from '@/hooks/navigateUX'

export default function Protected() {
  const [user] = useUserAtom()
  console.log('Protected', user)

  const [shouldIntercept, interceptedComponent] =
    useNavigateWithBackLinkAndToast()

  if (shouldIntercept) return interceptedComponent
  return <Outlet />
}
