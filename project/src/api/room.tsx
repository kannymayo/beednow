import {
  collection,
  serverTimestamp,
  where,
  doc,
  setDoc,
} from 'firebase/firestore'

import useUserAtom from '@/store/useUserAtom'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import {
  useQueryGetDoc,
  useQueryGetCollection,
} from '@/hooks/firebase-react-query-hooks'
import { db } from './firebase'

function useQueryGetTaggedRooms() {
  const [user] = useUserAtom()

  const queryHostedRoom = useQueryGetCollection<Room>(
    ['rooms', 'hosted'],
    [db, 'rooms'],
    [where('hostedBy', '==', user?.uid)],
    { subscribe: false },
    {
      enabled: !!user?.uid,
    }
  )

  const queryJoinedRoom = useQueryGetCollection<Room>(
    ['rooms', 'joined'],
    [db, 'rooms'],
    [where('joinedBy', 'array-contains', user?.uid)],
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
      name: 'New Room',
      hostedBy: user.uid,
      createdAt: serverTimestamp(),
    })
    return ref.id
  }
}

interface Room {
  id: string
  name: string
  hostedBy: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
}

function useQueryGetRoom() {
  const [roomId] = useRoomIdAtom()
  return useQueryGetDoc<Room>(['rooms', roomId], [db, 'rooms', roomId], {
    subscribe: true,
  })
}

function useIsSelfHosted() {
  const [user] = useUserAtom()
  const room = useQueryGetRoom()?.data
  if (!user.uid || !room) return false

  return room?.hostedBy === user?.uid
}

export {
  useQueryGetTaggedRooms,
  useCreateRoom,
  useQueryGetRoom,
  useIsSelfHosted,
}
