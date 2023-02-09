import { collection, serverTimestamp, addDoc } from 'firebase/firestore'

import { useQueryGetCollection } from '@/hooks/firebase-react-query-hooks'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { ItemFromAPI } from '@/api/item-details'
import { db } from './firebase'

function useAddItem() {
  const [roomId] = useRoomIdAtom()
  return add

  async function add(item: { details: ItemFromAPI; [any: string]: any }) {
    const ref = collection(db, 'rooms', roomId, 'items')
    await addDoc(ref, {
      ...item,
      createdAt: serverTimestamp(),
    })
  }
}

function useQueryGetItems() {
  const [roomId] = useRoomIdAtom()

  return useQueryGetCollection<ItemQueryData[]>(
    ['rooms', roomId, 'items'],
    [db, 'rooms', roomId, 'items'],
    [],
    { subscribe: true },
    {
      enabled: !!roomId,
    }
  )
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
