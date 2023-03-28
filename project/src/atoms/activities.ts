import { useAtomValue } from 'jotai'

import { firebaseCollectionAtomFamily } from './helper/firebase-atom-family'
import { RoomActivity } from '@/api/room'
import { useUserAtoms } from './user'

function useAsyncAtomRoomActivities({ isSubscribed = false } = {}) {
  const [user, isLoggedIn] = useUserAtoms().get()

  const roomActivitiesAtom = firebaseCollectionAtomFamily({
    segments: ['users', user?.uid, 'roomActivities'],
    isSubscribed,
  })

  return {
    getter: () => useAtomValue<RoomActivity[]>(roomActivitiesAtom),
  }
}

export { useAsyncAtomRoomActivities }
