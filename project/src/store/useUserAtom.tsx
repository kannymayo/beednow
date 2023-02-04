import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../api/firebase'

export const userAtom = atomWithStorage<UnifiedUser>('user', {})
const iconFallback = 'https://cdn-icons-png.flaticon.com/512/3940/3940403.png'

export default function useUserAtom() {
  const [user, setUser] = useAtom(userAtom)

  const [_user, _loading, _error] = useAuthState(auth, {
    onUserChanged: async (user) => {
      const photoURL = user?.photoURL || iconFallback
      const displayName = user?.displayName || user?.email || 'Anonymous'
      const provider = user?.providerId
      const uid = user?.uid
      setUser({ photoURL, displayName, provider, uid })
    },
  })

  return [user] as const
}

export interface UnifiedUser {
  displayName?: string
  email?: string
  provider?: string
  uid?: string
  photoURL?: string
  [key: string]: any
}
