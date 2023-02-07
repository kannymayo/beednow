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

function useGetTaggedRooms() {
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

function useGetRoom() {
  const _useDocData = useFirestoreDocumentData
  const [roomId] = useRoomIdAtom()

  if (!roomId) return null
  const ref = doc(db, 'rooms', roomId)
  const room = _useDocData(['rooms', roomId], ref)

  return room
}

function useIsSelfHosted() {
  const _useGetRoom = useGetRoom
  const [user] = useUserAtom()
  const [roomId] = useRoomIdAtom()

  if (!user || !roomId) return false
  const room = _useGetRoom()

  return room?.data?.hostedBy === user?.uid
}

export { useGetTaggedRooms, useCreateRoom, useGetRoom, useIsSelfHosted }
