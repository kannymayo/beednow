import { useEffect, useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { serverTimestamp, where } from 'firebase/firestore'

import { useQueryFirebase } from '@/hooks/firebase-react-query-hooks'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { ItemFromAPI } from '@/api/item-details'
import {
  upcreateFirebaseDoc,
  upcreateFirebaseDocWithAutoId,
  deleteFirebaseDoc,
} from './helper/firebase-CRUD-throwable'

interface Bidding {
  id: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  details: ItemFromAPI
  isInProgress: boolean
}

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

function useMutationStartBidding(
  { resetOnUnmount } = { resetOnUnmount: false }
) {
  const [roomId] = useRoomIdAtom()
  const [queryInProgressBidding] = useQueryInProgressBiddings()
  const refCleanupFn = useRef<() => void>(() => null)
  const inprogressBiddings = queryInProgressBidding.data
  const mutation = useMutation({
    mutationFn: startBidding,
  })

  refCleanupFn.current = clearInProgressBiddings

  // unmount will clear inprogress bidding
  useEffect(() => {
    if (!resetOnUnmount) return
    return () => {
      refCleanupFn?.current()
    }
  }, [])

  // refresh/closing will also clear inprogress bidding
  useEffect(() => {
    if (!resetOnUnmount) return
    window.addEventListener('beforeunload', refCleanupFn?.current)
    return () => {
      window.removeEventListener('beforeunload', refCleanupFn?.current)
    }
  }, [])

  return [mutation]

  async function clearInProgressBiddings() {
    // clear previous inprogress bidding
    if (!inprogressBiddings) return
    inprogressBiddings.forEach(async (inprogressBidding) => {
      await upcreateFirebaseDoc({
        segments: ['rooms', roomId, 'biddings', inprogressBidding.id],
        data: {
          isInProgress: false,
        },
      })
    })
  }

  async function startBidding(biddingId: string) {
    // clear previous inprogress bidding
    if (inprogressBiddings) {
      const allDeletion = inprogressBiddings.map((inprogressBidding) => {
        return upcreateFirebaseDoc({
          segments: ['rooms', roomId, 'biddings', inprogressBidding.id],
          data: {
            isInProgress: false,
          },
        })
      })
      await Promise.all(allDeletion)
    }
    // set new inprogress bidding
    await upcreateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', biddingId],
      data: {
        isInProgress: true,
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

function useQueryBiddings(roomId: string | undefined) {
  const [query, hasPendingWrites] = useQueryFirebase<Bidding[]>({
    segments: ['rooms', roomId, 'biddings'],
    isSubscribed: true,
  })
  return [query, hasPendingWrites] as const
}

function useQueryInProgressBiddings() {
  const [roomId] = useRoomIdAtom()
  const [query] = useQueryFirebase<Bidding[] | []>({
    segments: ['rooms', roomId, 'biddings'],
    isSubscribed: true,
    queryConstraints: [where('isInProgress', '!=', false)],
  })
  const hasMember = (query.data?.length || 0) > 0
  return [query, hasMember] as const
}

export {
  useAddItem,
  useQueryBiddings,
  useMutationDeleteItem,
  useMutationStartBidding,
  useQueryInProgressBiddings,
}
export type { Bidding }
