import { Outlet } from 'react-router-dom'
import { useNavigateWithBackLinkAndToast } from '@/hooks/navigateUX'

export default function Protected() {
  const [shouldIntercept, interceptedComponent] =
    useNavigateWithBackLinkAndToast()

  if (shouldIntercept) return interceptedComponent
  return <Outlet />
}
