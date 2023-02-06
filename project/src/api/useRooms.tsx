import {
  collection,
  query,
  serverTimestamp,
  where,
  doc,
} from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreCollectionMutation,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore'

import useUserAtom from '../store/useUserAtom'
import { db } from './firebase'

function useTaggedRooms() {
  const [user] = useUserAtom()
  const qryHostedRoom = query(
    collection(db, 'rooms'),
    where('hostedBy', '==', user?.uid)
  )
  const qryJoinedRoom = query(
    collection(db, 'rooms'),
    where('joinedBy', 'array-contains', user?.uid)
  )

  const hostedRooms = useFirestoreQueryData(['rooms'], qryHostedRoom, {
    idField: '_id',
    subscribe: true,
  })
  const joinedRooms = useFirestoreQueryData(['rooms'], qryJoinedRoom, {
    idField: '_id',
    subscribe: true,
  })

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

export { useTaggedRooms, useCreateRoom }
