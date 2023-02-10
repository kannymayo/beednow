import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  getDoc,
} from 'firebase/firestore'
import { useState } from 'react'

import useUserAtom from '@/store/useUserAtom'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import {
  useQueryGetDoc,
  useQueryGetCollection,
} from '@/hooks/firebase-react-query-hooks'
import { getRandomName } from '@/utils/random-name'
import { db } from './firebase'

interface FirebaseServerTimestamp {
  seconds: number
  nanoseconds: number
}

interface Room {
  id: string
  name: string
  hostedBy: string
  joinedBy: string[]
  attendees: string[] // realtime
  createdAt: FirebaseServerTimestamp
}

interface RoomActivity {
  id: string // room id
  type: 'joined' | 'hosted'
  lastModified: FirebaseServerTimestamp
}

function useQueryGetRoomActivities({
  enabled = true,
  subscribe = false,
}: {
  enabled?: boolean
  subscribe?: boolean
}) {
  const [user] = useUserAtom()
  const queryKey = ['users', 'roomActivities']
  const query = useQueryGetCollection<RoomActivity[]>(
    queryKey,
    [db, 'users', user?.uid, 'roomActivities'],
    [],
    { subscribe },
    { enabled }
  )
  return [query, queryKey] as const
}

function useCreateRoom() {
  const [user] = useUserAtom()
  const [updateRoomHosted] = useUpdateRoomHosted()
  return create

  async function create() {
    try {
      // room doc
      const ref = doc(collection(db, 'rooms'))
      await setDoc(ref, {
        name: getRandomName(),
        hostedBy: user.uid,
        createdAt: serverTimestamp(),
      })
      // user's roomActivities collection
      return updateRoomHosted(ref.id)
    } catch (e) {
      throw e
    }
  }
}

function useJoinRoom() {
  const [user] = useUserAtom()
  const [updateRoomJoined] = useUpdateRoomJoined()
  return [join]

  async function join(roomId: string) {
    try {
      // update room doc
      const refRoom = doc(db, 'rooms', roomId)
      const snapshotRoom = await getDoc(refRoom)
      const room = snapshotRoom.data() as Room
      // in reality it wouldn't trigger for lack of pre-condition
      if (!user.uid) throw Error('No logged-in user yet.')
      if (!room.joinedBy?.includes(user.uid)) {
        await updateDoc(refRoom, {
          joinedBy: [...(room.joinedBy || []), user.uid],
        })
      }
      // update user's roomActivities collection
      return updateRoomJoined(roomId)
    } catch (e) {
      throw e
    }
  }
}

/**
 * TODO: check user ban list
 */
function useUpdateRoomAcvitity() {
  const [user] = useUserAtom()
  return [updateRoomActivity]

  async function updateRoomActivity(roomId: string, activityType?: string) {
    if (!user.uid) throw Error('No logged-in user yet.')
    // no checking if room exists (should be server side or no one's business)
    const refRoomActivities = doc(
      db,
      'users',
      user.uid,
      'roomActivities',
      roomId
    )
    if (!activityType) {
      await setDoc(refRoomActivities, {
        lastModified: serverTimestamp(),
      })
    } else {
      await setDoc(refRoomActivities, {
        type: activityType,
        lastModified: serverTimestamp(),
      })
    }
  }
}

function useUpdateRoomJoined() {
  const [updateRoomActivity] = useUpdateRoomAcvitity()
  return [updateRoomJoined]

  function updateRoomJoined(roomId: string) {
    return updateRoomActivity(roomId, 'joined')
  }
}

function useUpdateRoomHosted() {
  const [updateRoomActivity] = useUpdateRoomAcvitity()
  return [updateRoomHosted]

  function updateRoomHosted(roomId: string) {
    return updateRoomActivity(roomId, 'hosted')
  }
}

function useQueryGetCurrentRoom() {
  const [roomId] = useRoomIdAtom()
  return useQueryGetDoc<Room>(['rooms', roomId], [db, 'rooms', roomId], {
    subscribe: true,
  })
}

function useReactiveQueryGetRoom(isSubscribed: boolean = false) {
  const [roomId, setRoomId] = useState('')
  const queryKey = ['rooms', roomId]
  const query = useQueryGetDoc<Room>(
    queryKey,
    [db, 'rooms', roomId],
    {
      subscribe: isSubscribed,
    },
    { enabled: !!roomId }
  )

  return [query, setRoomId, queryKey] as const
}

function useIsSelfHosted() {
  const [user] = useUserAtom()
  const room = useQueryGetCurrentRoom()?.data
  if (!user.uid || !room) return false

  return room?.hostedBy === user?.uid
}

export {
  useCreateRoom,
  useJoinRoom,
  useIsSelfHosted,
  useReactiveQueryGetRoom,
  useQueryGetRoomActivities,
  useQueryGetCurrentRoom,
}

export type { Room }
