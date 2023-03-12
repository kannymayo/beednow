import { useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../api/firebase'
import createAtomHooks from './helper/create-atom-hooks'
import { getAnimalAvatar } from '@/utils/get-random-avatar'

interface UnifiedUser {
  displayName?: string
  email?: string
  provider?: string
  uid?: string
  photoURL?: string
  [key: string]: any
}

const userAtom = atomWithStorage<UnifiedUser>('user', {})

// A blind conversion of the existing code, using multiple set() or getset()
// will be counter-performant
const useUserAtoms = createAtomHooks(userAtom, {
  getFn: () => {
    const user = useAtomValue(userAtom)
    const isLoggedIn = !!user?.uid
    return [user, isLoggedIn] as const
  },
  setFn: () => {
    const setUser = useSetAtom(userAtom)
    const [_user, _loading, _error] = useAuthState(auth, {
      onUserChanged: async (user) => {
        if (user?.uid) {
          const uid = user?.uid
          const photoURL = user?.photoURL || getAnimalAvatar()
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

    return setUser
  },
})

export type { UnifiedUser }
export { useUserAtoms }
