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

function useUserAtomMaster() {
  const [user, setUser] = useAtom(userAtom)
  const [_user, _loading, _error] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (user?.uid) {
        const uid = user?.uid
        const photoURL = user?.photoURL || iconFallback
        const displayName = user?.displayName || user?.email || 'Anonymous'
        const providerId = user?.providerData?.[0].providerId
        let provider = 'Email'
        switch (providerId) {
          case 'google.com':
            provider = 'Google'
            break
        }
        setUser({ photoURL, displayName, provider, uid })
      } else {
        setUser({})
      }
    },
  })
  const isLoggedIn = !!user?.uid

  return [user, isLoggedIn] as const
}

function useUserAtom() {
  const [user] = useAtom(userAtom)
  const isLoggedIn = !!user?.uid
  return [user, isLoggedIn] as const
}

export type { UnifiedUser }
export { useUserAtom, useUserAtomMaster }
