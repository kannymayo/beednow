import { atom, useAtom } from 'jotai'
import { useAuthState } from 'react-firebase-hooks/auth'
import { produce } from 'immer'

import { auth } from '../api/firebase'

export const userAtom = atom<UnifiedUser>({})
const iconFallback = 'https://cdn-icons-png.flaticon.com/512/3940/3940403.png'

export default function useUserAtom() {
  const [user, setUser] = useAtom(userAtom)

  const [_user, _loading, _error] = useAuthState(auth, {
    onUserChanged: async (user) => {
      setUser((prev) =>
        produce(prev, (draft) => {
          draft.photoURL = user?.photoURL || iconFallback
          draft.displayName = user?.displayName || user?.email || 'Anonymous'
          draft.provider = user?.providerId
          draft.uid = user?.uid
        })
      )
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
