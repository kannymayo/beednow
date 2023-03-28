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
import { useAtomRoomIdCurrent, useAtomIsRoomHost } from '@/store/useRoomAtom'
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
  useMutationShorten,
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
  const roomId = useAtomRoomIdCurrent().getter()
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

/**
 * Join a finished bidding back to the pending list with selectable clean
 * level. If in mutation fn, willWipeHistory is true, will wipe history of
 * offers, and no matter what, the closing-* fields will be removed
 */
function useMutationRestoreBidding() {
  const roomId = useAtomRoomIdCurrent().getter()
  const mutation = useMutation({
    mutationFn: mutateFnRestoreBidding,
  })

  return [mutation]

  async function mutateFnRestoreBidding({
    id,
    willWipeHistory = false,
  }: {
    id: string
    willWipeHistory?: boolean
  }) {
    const _offers = willWipeHistory ? { offers: [] } : undefined
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', id],
      data: {
        isInProgress: false,
        isEnded: false,
        isPaused: false,
        pausedAt: deleteField(),
        endsAt: deleteField(),
        hasClosingOffer: false,
        closingAmount: deleteField(),
        closingTime: deleteField(),
        closingUserId: deleteField(),
        closingUsername: deleteField(),
        ..._offers,
      } as BiddingModification,
    })
  }
}

function useMutationStartBidding() {
  const LATENCY_COMPENSATION = 0
  const roomId = useAtomRoomIdCurrent().getter()
  const mutation = useMutation({
    mutationFn: mutateFnStartBidding,
  })

  return [mutation]

  async function mutateFnStartBidding({
    id,
    initialCountdown = 60,
    willWipeHistory = false,
  }: {
    id: string
    initialCountdown?: number
    willWipeHistory?: boolean
  }) {
    const _offers = willWipeHistory ? { offers: [] } : undefined
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', id],
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
        ..._offers,
      } as BiddingModification,
    })
  }
}

function useMutationResetAllInProgressBiddings(
  { resetOnUnmount } = { resetOnUnmount: false }
) {
  const roomId = useAtomRoomIdCurrent().getter()
  const isRoomHost = useAtomIsRoomHost().getter()
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
    exceptBiddingId,
  }: {
    exceptBiddingId: string
  }) {
    // clear all inprogress bidding, except the one specified
    if (inprogressBiddings) {
      const allDeletion = inprogressBiddings.map((inprogressBidding) => {
        if (inprogressBidding.id === exceptBiddingId) return

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
      return Promise.all(allDeletion)
    }
  }
}

function useMutationDeleteItem() {
  const roomId = useAtomRoomIdCurrent().getter()
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
  const roomId = useAtomRoomIdCurrent().getter()
  const highestOffer = useHighestOfferAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnEndOffer,
  })

  return [mutation]

  async function mutateFnEndOffer({ id }: { id: string }) {
    const closingAmount = highestOffer?.amount
    const closingTime = highestOffer?.createdAt
    const closingUserId = highestOffer?.userId
    const closingUsername = highestOffer?.username

    // no valid closing offer
    if (
      [closingAmount, closingTime, closingUserId, closingUsername].some(isVoid)
    ) {
      return await updateFirebaseDoc({
        segments: ['rooms', roomId, 'biddings', id],
        data: {
          isEnded: true,
          isInProgress: false,
          endsAt: serverTimestamp(),
          hasClosingOffer: false,
        } as BiddingModification,
      })
    } else {
      return await updateFirebaseDoc({
        segments: ['rooms', roomId, 'biddings', id],
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
  useMutationStartBidding,
  useMutationEndBidding,
  useMutationDeleteItem,
  useMutationRestoreBidding,
  useMutationResetAllInProgressBiddings,
  useMutationPause as useMutationPauseBidding,
  useMutationResume as useMutationResumeBidding,
  useMutationExtend as useMutationExtendBidding,
  useMutationShorten as useMutationShortenBidding,
  useMutationSendElapsed as useMutationSendBiddingElapsed,
}
export type { Bidding, BiddingModification }
