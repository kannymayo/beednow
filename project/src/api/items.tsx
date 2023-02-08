import { collection, serverTimestamp } from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreCollectionMutation,
} from '@react-query-firebase/firestore'
import { UseQueryResult } from 'react-query'

import { useRoomIdAtom } from '@/store/useRoomAtom'
import { ItemFromAPI } from '@/api/item-details'
import { db } from './firebase'

function useAddItem() {
  const [roomId] = useRoomIdAtom()
  const ref = collection(db, 'rooms', roomId, 'items')
  const mutation = useFirestoreCollectionMutation(ref)

  return add

  function add(item: { details: ItemFromAPI; [any: string]: any }) {
    mutation.mutate({
      ...item,
      createdAt: serverTimestamp(),
    })
  }
}

function useQueryGetItems() {
  const [roomId] = useRoomIdAtom()
  let ref
  if (roomId) {
    ref = collection(db, 'rooms', roomId, 'items')
  }
  const items = useFirestoreQueryData(
    ['rooms', roomId, 'items'],
    ref,
    {
      idField: 'id',
      subscribe: true,
    },
    {
      enabled: !!roomId && ref !== undefined,
    }
  )

  return items as UseQueryResult<ItemQueryData[]>
}

interface ItemQueryData {
  id: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  details: ItemFromAPI
}

export { useAddItem, useQueryGetItems }
export type { ItemQueryData }
