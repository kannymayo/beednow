import { useMutation } from '@tanstack/react-query'
import { Timestamp, arrayUnion } from 'firebase/firestore'

import { useUserAtoms } from '@/store/useUserAtom'
import { useAtomRoomId } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtoms } from '@/store/useBiddingAtom'
import { updateFirebaseDoc } from './helper/firebase-CRUD-throwable'

// Offer is embeded in Bidding in Firestore, and current Firestore doesn't
// support serverTimestamp.
// Did this because deleting subcollection is a pain in Firestore.
type EventType =
  | 'pause'
  | 'extend'
  | 'resume'
  | 'elapsed'
  | 'shorten'
  | undefined
interface Offer<TEvent extends EventType = undefined> {
  userId: string
  username: string
  userAvatar: string
  createdAt: Timestamp
  // when there is no amount, it is an event joined to the timeline.
  amount?: TEvent extends 'pause' | undefined ? number : never
  // set by current host
  event?: EventType
  // client-side only. persisting to DB is acceptable, since client overwrites
  // it all the time. just to keep TS happy about the derived data.
  isValid?: boolean
}

function useMakeOffer() {
  const [user] = useUserAtoms().get()
  const roomId = useAtomRoomId().getter()
  const [[bidding]] = useInProgressBiddingsAtoms().get()
  const mutation = useMutation({
    mutationFn: mutateFnMakeOffer,
  })

  const offers = bidding?.offers || []

  return [mutation]

  async function mutateFnMakeOffer(amount: number) {
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        offers: arrayUnion({
          userId: user.uid,
          username: user.displayName,
          userAvatar: user.photoURL,
          amount,
          createdAt: new Date(),
        }),
      },
    })
  }
}

export type { Offer }
export { useMakeOffer }
