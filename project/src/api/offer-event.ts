import { useMutation } from '@tanstack/react-query'
import { Timestamp, arrayUnion, serverTimestamp } from 'firebase/firestore'

import { useUserAtoms } from '@/store/useUserAtom'
import { useRoomIdAtoms } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtoms } from '@/store/useBiddingAtom'
import { updateFirebaseDoc } from './helper/firebase-CRUD-throwable'

import { BiddingModification } from './bidding'

// All members can make offers to a bidding. On the same level of
// data modeling, the host can dispatch these events to the bidding.
// Other members can have limited access to pause.

// From a state machine perspective, bidding can:
//  -Be paused state until it is ended.
//  -Be extended even after it is ended.
//  -Be auto staged, after the primary countdown is over.
//    - Upon staging, a secondary countdown starts.
//  -Be auto ended, after secondary countdown is over.

function useMutationPause() {
  const [user] = useUserAtoms().get()
  const roomId = useRoomIdAtoms().get()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()

  const mutation = useMutation({
    mutationFn: mutateFnPauseBidding,
  })

  return [mutation]

  async function mutateFnPauseBidding() {
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        isPaused: true,
        pausedAt: serverTimestamp(),
        offers: arrayUnion({
          userId: user.uid,
          userName: user.displayName,
          createdAt: serverTimestamp(),
          event: 'pause',
        }),
      } as BiddingModification,
    })
  }
}

/**
 * Mutates ispausd, endsAt, besides sending event
 */
function useMutationResume() {
  const [user] = useUserAtoms().get()
  const roomId = useRoomIdAtoms().get()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnResumeOffer,
  })

  return [mutation]

  async function mutateFnResumeOffer() {
    const remainingTime =
      bidding?.endsAt.toMillis() - bidding?.pausedAt.toMillis()
    const newEnd = new Date()
    newEnd.setMilliseconds(newEnd.getMilliseconds() + remainingTime)

    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        isPaused: false,
        endsAt: newEnd,
        offers: arrayUnion({
          userId: user.uid,
          userName: user.displayName,
          createdAt: serverTimestamp(),
          event: 'resume',
        }),
      } as BiddingModification,
    })
  }
}

/**
 * Mutates endsAt, besides sending event
 */
function useMutationExtend() {
  const [user] = useUserAtoms().get()
  const roomId = useRoomIdAtoms().get()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnExtendOffer,
  })

  return [mutation]

  async function mutateFnExtendOffer({
    seconds = 15,
    base,
  }: {
    seconds?: number
    base?: Timestamp
  }) {
    if (base) {
      var newEnd = base.toDate()
      newEnd.setMilliseconds(newEnd.getMilliseconds() + seconds * 1000)
    } else {
      var newEnd = new Date()
      newEnd.setMilliseconds(newEnd.getMilliseconds() + seconds * 1000)
    }
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        endsAt: newEnd,
        offers: arrayUnion({
          userId: user.uid,
          userName: user.displayName,
          createdAt: new Date(),
          event: 'extend',
        }),
      } as BiddingModification,
    })
  }
}

/**
 * Sends event only
 */
function useMutationStage() {
  const [user] = useUserAtoms().get()
  const roomId = useRoomIdAtoms().get()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnStageOffer,
  })

  return [mutation]

  async function mutateFnStageOffer() {
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        offers: arrayUnion({
          userId: user.uid,
          userName: user.displayName,
          createdAt: serverTimestamp(),
          event: 'stage',
        }),
      } as BiddingModification,
    })
  }
}

/**
 * Mutates isEnded, isInProgress, endsAt (why not? like minor
 * correction)
 */
function useMutationEnd() {
  const [user] = useUserAtoms().get()
  const roomId = useRoomIdAtoms().get()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnEndOffer,
  })

  return [mutation]

  async function mutateFnEndOffer() {
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        isEnded: true,
        isInProgress: false,
        endsAt: serverTimestamp(),
      } as BiddingModification,
    })
  }
}

export {
  useMutationPause,
  useMutationResume,
  useMutationExtend,
  useMutationStage,
  useMutationEnd,
}
