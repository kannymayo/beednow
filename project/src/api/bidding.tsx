import { useMutation } from '@tanstack/react-query'
import { serverTimestamp } from 'firebase/firestore'

import { useQueryFirebase } from '@/hooks/firebase-react-query-hooks'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { ItemFromAPI } from '@/api/item-details'
import {
  upcreateFirebaseDocWithAutoId,
  deleteFirebaseDoc,
} from './helper/firebase-CRUD-throwable'

function useAddItem() {
  const [roomId] = useRoomIdAtom()
  return [addItem]

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

function useMutationDeleteItem() {
  const [roomId] = useRoomIdAtom()
  const mutation = useMutation({
    mutationFn: deleteItem,
  })

  return [mutation]

  async function deleteItem(biddingId: string) {
    return await deleteFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', biddingId],
    })
  }
}

function useQueryGetBiddings(roomId: string | undefined) {
  const [query, hasPendingWrites] = useQueryFirebase<Bidding[]>({
    segments: ['rooms', roomId, 'biddings'],
    isSubscribed: true,
  })
  return [query, hasPendingWrites] as const
}

interface Bidding {
  id: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  details: ItemFromAPI
}

export { useAddItem, useQueryGetBiddings, useMutationDeleteItem }
export type { Bidding }
