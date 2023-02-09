import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  addDoc,
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

interface Room {
  id: string
  name: string
  hostedBy: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
}

function useQueryGetTaggedRooms() {
  const [user] = useUserAtom()

  const queryHostedRoom = useQueryGetCollection<Room[]>(
    ['users', 'hosted'],
    [db, 'users', user?.uid, 'hosted'],
    [],
    { subscribe: false },
    {
      enabled: !!user?.uid,
    }
  )

  const queryJoinedRoom = useQueryGetCollection<Room[]>(
    ['users', 'joined'],
    [db, 'users', user?.uid, 'joined'],
    [],
    { subscribe: false },
    {
      enabled: !!user?.uid,
    }
  )

  return [queryHostedRoom, queryJoinedRoom]
}

function useCreateRoom() {
  const [user] = useUserAtom()
  return create

  async function create() {
    const ref = doc(collection(db, 'rooms'))
    await setDoc(ref, {
      name: getRandomName(),
      hostedBy: user.uid,
      createdAt: serverTimestamp(),
    })
    return ref.id
  }
}

/**
 * TODO: check user ban list
 */
function useUpdateRoomsJoined() {
  const [user] = useUserAtom()
  return updateRoomsJoined

  async function updateRoomsJoined(roomId: string) {
    if (!user.uid) throw Error('No logged-in user yet.')
    // no checking if room exists (should be server side or no one's business)
    const refRoomJoined = doc(db, 'users', user.uid, 'roomsJoined', roomId)
    await setDoc(refRoomJoined, {
      lastJoinedAt: serverTimestamp(),
    })
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
  const query = useQueryGetDoc<Room>(
    ['rooms', roomId],
    [db, 'rooms', roomId],
    {
      subscribe: isSubscribed,
    },
    { enabled: !!roomId }
  )

  return [query, setRoomId] as const
}

function useIsSelfHosted() {
  const [user] = useUserAtom()
  const room = useQueryGetCurrentRoom()?.data
  if (!user.uid || !room) return false

  return room?.hostedBy === user?.uid
}

export {
  useQueryGetTaggedRooms,
  useQueryGetCurrentRoom,
  useCreateRoom,
  useIsSelfHosted,
  useUpdateRoomsJoined,
  useReactiveQueryGetRoom,
}

export type { Room }
