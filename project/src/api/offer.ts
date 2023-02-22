import { useMutation } from '@tanstack/react-query'
import { Timestamp } from 'firebase/firestore'

import { useUserAtoms } from '@/store/useUserAtom'
import { useRoomIdAtoms } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtoms } from '@/store/useBiddingAtom'
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
  const [user] = useUserAtoms().get()
  const roomId = useRoomIdAtoms().get()
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
