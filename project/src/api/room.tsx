import {
  collection,
  query,
  serverTimestamp,
  where,
  doc,
} from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreDocumentData,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore'

import useUserAtom from '@/store/useUserAtom'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { db } from './firebase'

function useQueryGetTaggedRooms() {
  const [user] = useUserAtom()
  const qryHostedRoom = query(
    collection(db, 'rooms'),
    where('hostedBy', '==', user?.uid)
  )
  const qryJoinedRoom = query(
    collection(db, 'rooms'),
    where('joinedBy', 'array-contains', user?.uid)
  )

  const hostedRooms = useFirestoreQueryData(
    ['rooms', 'hosted'],
    qryHostedRoom,
    {
      idField: 'id',
      subscribe: true,
    }
  )
  const joinedRooms = useFirestoreQueryData(
    ['rooms', 'joined'],
    qryJoinedRoom,
    {
      idField: 'id',
      subscribe: true,
    }
  )

  return [hostedRooms, joinedRooms]
}

function useCreateRoom() {
  const [user] = useUserAtom()
  const ref = doc(collection(db, 'rooms'))
  const mutation = useFirestoreDocumentMutation(ref)

  return create

  function create() {
    mutation.mutate({
      name: 'New Room',
      hostedBy: user.uid,
      createdAt: serverTimestamp(),
    })
    return ref.id
  }
}

function useQueryGetRoom() {
  const [roomId] = useRoomIdAtom()
  let ref
  if (roomId) {
    ref = doc(collection(db, 'rooms'), roomId)
  }
  const room = useFirestoreDocumentData(['rooms', roomId], ref, undefined, {
    enabled: !!roomId,
  })

  if (!room) return null
  if (room.error) {
    console.warn('invalid room id')
  }
  return room
}

function useIsSelfHosted() {
  const [user] = useUserAtom()
  const room = useQueryGetRoom()?.data

  if (!user.uid || !room) return false
  return room?.data?.hostedBy === user?.uid
}

export {
  useQueryGetTaggedRooms,
  useCreateRoom,
  useQueryGetRoom,
  useIsSelfHosted,
}
