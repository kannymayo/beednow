import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  serverTimestamp,
  where,
  deleteField,
  FieldValue,
  Timestamp,
} from 'firebase/firestore'

import { useQueryFirebase } from '@/hooks/firebase-react-query-hooks'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtom } from '@/store/useBiddingAtom'
import { ItemFromAPI } from '@/api/item-details'
import {
  upcreateFirebaseDoc,
  upcreateFirebaseDocWithAutoId,
  deleteFirebaseDoc,
} from './helper/firebase-CRUD-throwable'

interface Bidding {
  id: string
  createdAt: Timestamp
  details: ItemFromAPI
  isInProgress: boolean
  isPaused: boolean
  isEnded: boolean
  pausedAt: Timestamp
  endsAt: Timestamp
}

// well done, chatGPT
type BiddingModification = {
  [K in keyof Partial<Bidding>]: Bidding[K] | FieldValue | Date
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
  const LATENCY_COMPENSATION = 499
  const [roomId] = useRoomIdAtom()
  const [queryInProgressBidding] = useInProgressBiddingsAtom()
  const refCleanupFn = useRef<() => void>(() => null)
  const inprogressBiddings = queryInProgressBidding
  const mutation = useMutation({
    mutationFn: mutateStartBidding,
  })

  // prevent cleanup from capturing the first render's closure, in which
  // inprogressBiddings is undefined
  // more info: NPM ahooks/useLatest
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
          isEnded: false,
          isPaused: false,
          pausedAt: deleteField(),
          endsAt: deleteField(),
        } as BiddingModification,
      })
    })
  }

  async function mutateStartBidding({
    biddingId,
    initialCountdown = 60,
  }: {
    biddingId: string
    initialCountdown?: number
  }) {
    // clear previous inprogress bidding
    if (inprogressBiddings) {
      const allDeletion = inprogressBiddings.map((inprogressBidding) => {
        // exclude the current bidding
        if (inprogressBidding.id === biddingId) return

        return upcreateFirebaseDoc({
          segments: ['rooms', roomId, 'biddings', inprogressBidding.id],
          data: {
            isInProgress: false,
            isEnded: false,
            isPaused: false,
            pausedAt: deleteField(),
            endsAt: deleteField(),
          } as BiddingModification,
        })
      })
      await Promise.all(allDeletion)
    }
    // set new inprogress bidding
    await upcreateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', biddingId],
      data: {
        isInProgress: true,
        endsAt: (() => {
          const now = new Date()
          now.setMilliseconds(
            now.getMilliseconds() +
              initialCountdown * 1000 +
              LATENCY_COMPENSATION
          )
          return now
        })(),
      } as BiddingModification,
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
}
export type { Bidding }
