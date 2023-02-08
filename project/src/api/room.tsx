import {
  collection,
  query,
  serverTimestamp,
  where,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'

import useUserAtom from '@/store/useUserAtom'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { useQuery } from 'react-query'
import { db } from './firebase'

function useQueryGetTaggedRooms() {
  const [user] = useUserAtom()
  const queryHostedRoom = useQuery(
    ['rooms', 'hosted'],
    async () => {
      const qry = query(
        collection(db, 'rooms'),
        where('hostedBy', '==', user?.uid)
      )
      const querySnapshot = await getDocs(qry)
      return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    },
    {
      enabled: !!user?.uid,
    }
  )
  const queryJoinedRoom = useQuery(
    ['rooms', 'joined'],
    async () => {
      const qry = query(
        collection(db, 'rooms'),
        where('joinedBy', 'array-contains', user?.uid)
      )
      const querySnapshot = await getDocs(qry)
      return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    },
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
  const query = useQuery(
    ['rooms', roomId],
    async () => {
      const ref = doc(collection(db, 'rooms'), roomId)
      const docSnapshot = await getDoc(ref)
      return { ...docSnapshot.data(), id: docSnapshot.id } as Room
    },
    {
      enabled: !!roomId,
    }
  )
  return query
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
