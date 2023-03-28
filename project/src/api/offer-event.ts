import { useMutation } from '@tanstack/react-query'
import { Timestamp, arrayUnion, serverTimestamp } from 'firebase/firestore'

import { useUserAtoms } from '@/store/useUserAtom'
import { useAtomRoomIdCurrent } from '@/store/useRoomAtom'
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
  const roomId = useAtomRoomIdCurrent().getter()
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
          username: user.displayName,
          userAvatar: user.photoURL,
          createdAt: new Date(),
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
  const roomId = useAtomRoomIdCurrent().getter()
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
          username: user.displayName,
          userAvatar: user.photoURL,
          createdAt: new Date(),
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
  const roomId = useAtomRoomIdCurrent().getter()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnExtendOffer,
  })

  return [mutation]

  async function mutateFnExtendOffer({ seconds = 15 }: { seconds?: number }) {
    const isEndBehindNow = bidding?.endsAt.toMillis() < Date.now()
    const baseMillis = isEndBehindNow ? Date.now() : bidding?.endsAt.toMillis()

    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        endsAt: new Date(baseMillis + seconds * 1000),
        offers: arrayUnion({
          userId: user.uid,
          username: user.displayName,
          userAvatar: user.photoURL,
          amount: seconds,
          createdAt: new Date(),
          event: 'extend',
        }),
      } as BiddingModification,
    })
  }
}

function useMutationShorten() {
  const [user] = useUserAtoms().get()
  const roomId = useAtomRoomIdCurrent().getter()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnShortenOffer,
  })

  return [mutation]

  async function mutateFnShortenOffer({ seconds = 15 }: { seconds?: number }) {
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        endsAt: new Date(bidding.endsAt.toMillis() - seconds * 1000),
        offers: arrayUnion({
          userId: user.uid,
          username: user.displayName,
          userAvatar: user.photoURL,
          amount: seconds,
          createdAt: new Date(),
          event: 'shorten',
        }),
      } as BiddingModification,
    })
  }
}

function useMutationSendElapsed() {
  const [user] = useUserAtoms().get()
  const roomId = useAtomRoomIdCurrent().getter()
  const [[bidding], hasMember] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnSendElapsed,
  })

  return [mutation]

  async function mutateFnSendElapsed() {
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        offers: arrayUnion({
          userId: user.uid,
          username: user.displayName,
          userAvatar: user.photoURL,
          // kinda conflicts with endsAt
          createdAt: new Date(),
          event: 'elapsed',
        }),
      } as BiddingModification,
    })
  }
}

export {
  useMutationPause,
  useMutationResume,
  useMutationExtend,
  useMutationShorten,
  useMutationSendElapsed,
}
