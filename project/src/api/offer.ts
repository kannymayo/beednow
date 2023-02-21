import { useMutation } from '@tanstack/react-query'
import { Timestamp } from 'firebase/firestore'

import { useUserAtomValue } from '@/store/useUserAtom'
import { useRoomIdAtomValue } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtomValue } from '@/store/useBiddingAtom'
import { updateFirebaseDoc } from './helper/firebase-CRUD-throwable'

// Offer is embeded in Bidding in Firestore, and current Firestore doesn't
// support serverTimestamp.
// Did this because deleting subcollection is a pain in Firestore.
interface Offer {
  userId: string
  userName: string
  amount: number
  createdAt: Timestamp
  // client-side only. persisting to DB is acceptable, since client overwrites
  // it all the time. just to keep TS happy about the derived data.
  isValid?: boolean
}

function useMakeOffer() {
  const [user] = useUserAtomValue()
  const roomId = useRoomIdAtomValue()
  const [[bidding]] = useInProgressBiddingsAtomValue()
  const mutation = useMutation({
    mutationFn: mutateFnMakeOffer,
  })

  const offers = bidding?.offers || []

  return [mutation]

  async function mutateFnMakeOffer(amount: number) {
    return await updateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', bidding?.id],
      data: {
        offers: [
          ...offers,
          {
            userId: user.uid,
            userName: user.displayName,
            amount,
            createdAt: new Date(),
          },
        ],
      },
    })
  }
}

export type { Offer }
export { useMakeOffer }