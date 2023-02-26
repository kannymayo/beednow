import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  serverTimestamp,
  deleteField,
  FieldValue,
  Timestamp,
} from 'firebase/firestore'

import { isVoid } from '@/utils/is-void'
import { useQueryFirebase } from '@/hooks/firebase-react-query-hooks'
import { useHighestOfferAtoms } from '@/store/useOfferAtom'
import { useRoomIdAtoms, useIsRoomHostAtoms } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtoms } from '@/store/useBiddingAtom'
import { ItemFromAPI } from '@/api/item-details'
import {
  updateFirebaseDoc,
  upcreateFirebaseDoc,
  upcreateFirebaseDocWithAutoId,
  deleteFirebaseDoc,
} from './helper/firebase-CRUD-throwable'
import { Offer } from './offer'
import {
  useMutationPause,
  useMutationResume,
  useMutationExtend,
  useMutationSendElapsed,
} from './offer-event'

interface Bidding {
  id: string
  createdAt: Timestamp
  details: ItemFromAPI
  isInProgress: boolean
  isPaused: boolean
  isEnded: boolean
  pausedAt: Timestamp
  endsAt: Timestamp
  offers: Offer[]
  // deducible from offers
  hasClosingOffer: boolean
  closingAmount: number
  closingTime: Timestamp
  closingUserId: string
  closingUsername: string
  closingUserAvatar: string
}

// well done, chatGPT
type BiddingModification = {
  [K in keyof Partial<Bidding>]: Bidding[K] | FieldValue | Date
}

function useAddItem() {
  const roomId = useRoomIdAtoms().get()
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

function useMutationResetBidding(
  { resetOnUnmount } = { resetOnUnmount: false }
) {
  const LATENCY_COMPENSATION = 0
  const roomId = useRoomIdAtoms().get()
  const isRoomHost = useIsRoomHostAtoms().get()
  const [inprogressBiddings] = useInProgressBiddingsAtoms().get()
  const refClearAllFn = useRef<() => void>(() => null)
  const mutation = useMutation({
    mutationFn: mutateFnResetBidding,
  })

  // prevent cleanup from capturing the first render's closure, in which
  // inprogressBiddings is undefined
  // more info: NPM ahooks/useLatest
  refClearAllFn.current = clearAll

  // Unmount will clear all
  useEffect(() => {
    if (!resetOnUnmount || !isRoomHost) return
    return () => {
      refClearAllFn?.current()
    }
  }, [isRoomHost])

  // Refresh/Close tab will clear all
  useEffect(() => {
    const fn = () => {
      refClearAllFn?.current()
    }
    if (!resetOnUnmount || !isRoomHost) return
    window.addEventListener('beforeunload', fn)
    return () => {
      window.removeEventListener('beforeunload', fn)
    }
  }, [isRoomHost])

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
          offers: [],
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
            offers: [],
          } as BiddingModification,
        })
      })
      await Promise.all(allDeletion)
    }
    // resets the specified bidding and give it a new end time
    await upcreateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', biddingId],
      data: {
        isInProgress: true,
        isEnded: false,
        isPaused: false,
        pausedAt: deleteField(),
        endsAt: (() => {
          const now = new Date()
          now.setMilliseconds(
            now.getMilliseconds() +
              initialCountdown * 1000 +
              LATENCY_COMPENSATION
          )
          return now
        })(),
        offers: [],
      } as BiddingModification,
    })
  }
}

function useMutationDeleteItem() {
  const roomId = useRoomIdAtoms().get()
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

/**
 * Mutates isEnded, isInProgress, endsAt (why not? like minor
 * correction)
 */
function useMutationEndBidding() {
  const roomId = useRoomIdAtoms().get()
  const highestOffer = useHighestOfferAtoms().get()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnEndOffer,
  })

  return [mutation]

  async function mutateFnEndOffer() {
    const closingAmount = highestOffer?.amount
    const closingTime = highestOffer?.createdAt
    const closingUserId = highestOffer?.userId
    const closingUsername = highestOffer?.username

    // no valid closing offer
    if (
      [closingAmount, closingTime, closingUserId, closingUsername].some(isVoid)
    ) {
      return await updateFirebaseDoc({
        segments: ['rooms', roomId, 'biddings', bidding?.id],
        data: {
          isEnded: true,
          isInProgress: false,
          endsAt: serverTimestamp(),
          hasClosingOffer: false,
        } as BiddingModification,
      })
    } else {
      return await updateFirebaseDoc({
        segments: ['rooms', roomId, 'biddings', bidding?.id],
        data: {
          isEnded: true,
          isInProgress: false,
          endsAt: serverTimestamp(),
          hasClosingOffer: true,
          closingAmount,
          closingTime,
          closingUserId,
          closingUsername,
        } as BiddingModification,
      })
    }
  }
}

function useQueryBiddings(roomId: string | undefined) {
  const [query, hasPendingWrites] = useQueryFirebase<Bidding[]>({
    segments: ['rooms', roomId, 'biddings'],
    isSubscribed: true,
  })
  return [query, hasPendingWrites] as const
}

export {
  useAddItem,
  useQueryBiddings,
  useMutationDeleteItem,
  useMutationResetBidding,
  useMutationPause as useMutationPauseBidding,
  useMutationResume as useMutationResumeBidding,
  useMutationExtend as useMutationExtendBidding,
  useMutationSendElapsed as useMutationSendBiddingElapsed,
  useMutationEndBidding,
}
export type { Bidding, BiddingModification }
