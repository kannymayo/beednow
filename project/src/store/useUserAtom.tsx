import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../api/firebase'

interface UnifiedUser {
  displayName?: string
  email?: string
  provider?: string
  uid?: string
  photoURL?: string
  [key: string]: any
}

const userAtom = atomWithStorage<UnifiedUser>('user', {})
const iconFallback = 'https://cdn-icons-png.flaticon.com/512/3940/3940403.png'

function useUserAtom() {
  const [user, setUser] = useAtom(userAtom)
  const [_user, _loading, _error] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (user?.uid) {
        const uid = user?.uid
        const photoURL = user?.photoURL || iconFallback
        const displayName = user?.displayName || user?.email || 'Anonymous'
        const provider =
          user?.providerId === 'firebase' ? 'email' : user?.providerId
        setUser({ photoURL, displayName, provider, uid })
      } else {
        setUser({})
      }
    },
  })
  const isLoggedIn = !_loading && !_error

  return [user, isLoggedIn] as const
}

export type { UnifiedUser }
export { useUserAtom }
