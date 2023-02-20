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

function useMutationGrantMoreTime() {
  const [roomId] = useRoomIdAtom()
  const mutation = useMutation({
    mutationFn: mutateFnGrantMoreTime,
  })

  return [mutation]

  async function mutateFnGrantMoreTime({
    biddingId,
    seconds = 15,
    base,
  }: {
    biddingId: string
    seconds?: number
    base?: Timestamp
  }) {
    // Base provided, relatively set to x seconds from base
    if (base) {
      await upcreateFirebaseDoc({
        segments: ['rooms', roomId, 'biddings', biddingId],
        data: {
          endsAt: (() => {
            const baseDate = new Date(base.toMillis())
            baseDate.setMilliseconds(
              baseDate.getMilliseconds() + seconds * 1000
            )
            return baseDate
          })(),
        } as BiddingModification,
      })
    }
    // No base, absolute time x seconds from now
    else {
      await upcreateFirebaseDoc({
        segments: ['rooms', roomId, 'biddings', biddingId],
        data: {
          endsAt: (() => {
            const now = new Date()
            now.setMilliseconds(now.getMilliseconds() + seconds * 1000)
            return now
          })(),
        } as BiddingModification,
      })
    }
  }
}

function useMutationResetBidding(
  { resetOnUnmount } = { resetOnUnmount: false }
) {
  const LATENCY_COMPENSATION = 499
  const [roomId] = useRoomIdAtom()
  const [queryInProgressBidding] = useInProgressBiddingsAtom()
  const refClearAllFn = useRef<() => void>(() => null)
  const inprogressBiddings = queryInProgressBidding
  const mutation = useMutation({
    mutationFn: mutateFnResetBidding,
  })

  // prevent cleanup from capturing the first render's closure, in which
  // inprogressBiddings is undefined
  // more info: NPM ahooks/useLatest
  refClearAllFn.current = clearAll

  // Unmount will clear all
  useEffect(() => {
    if (!resetOnUnmount) return
    return () => {
      refClearAllFn?.current()
    }
  }, [])

  // Refresh/Close tab will clear all
  useEffect(() => {
    const fn = () => {
      refClearAllFn?.current()
    }
    if (!resetOnUnmount) return
    window.addEventListener('beforeunload', fn)
    return () => {
      window.removeEventListener('beforeunload', fn)
    }
  }, [])

  return [mutation]

  async function clearAll() {
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

  async function mutateFnResetBidding({
    biddingId,
    initialCountdown = 60,
  }: {
    biddingId: string
    initialCountdown?: number
  }) {
    // clear all inprogress bidding, except the one we are about to start
    if (inprogressBiddings) {
      const allDeletion = inprogressBiddings.map((inprogressBidding) => {
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
    // resets the bidding and give it a new end time
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
  useMutationResetBidding,
}
export type { Bidding }
