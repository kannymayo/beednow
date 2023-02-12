import { serverTimestamp } from 'firebase/firestore'

import { useQueryFirebase } from '@/hooks/firebase-react-query-hooks'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { ItemFromAPI } from '@/api/item-details'
import { upcreateFirebaseDocWithAutoId } from './helper/firebase-CRUD-throwable'

function useAddItem() {
  const [roomId] = useRoomIdAtom()
  return addItem

  async function addItem(item: { details: ItemFromAPI; [any: string]: any }) {
    return await upcreateFirebaseDocWithAutoId({
      segments: ['rooms', roomId, 'items'],
      data: {
        ...item,
        createdAt: serverTimestamp(),
      },
    })
  }
}

function useQueryGetItems() {
  const [roomId] = useRoomIdAtom()

  return useQueryFirebase<ItemQueryData[]>({
    segments: ['rooms', roomId, 'items'],
    isSubscribed: true,
  })
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
