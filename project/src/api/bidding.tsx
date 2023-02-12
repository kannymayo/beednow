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
      segments: ['rooms', roomId, 'biddings'],
      data: {
        ...item,
        createdAt: serverTimestamp(),
      },
    })
  }
}

function useQueryGetBiddings(roomId: string | undefined) {
  return useQueryFirebase<Bidding[]>({
    segments: ['rooms', roomId, 'biddings'],
    isSubscribed: true,
  })
}

interface Bidding {
  id: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  details: ItemFromAPI
}

export { useAddItem, useQueryGetBiddings }
export type { Bidding }
