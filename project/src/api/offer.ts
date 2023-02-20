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
import { useRoomIdAtomValue } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtomValue } from '@/store/useBiddingAtom'
import { ItemFromAPI } from '@/api/item-details'
import {
  upcreateFirebaseDoc,
  upcreateFirebaseDocWithAutoId,
  deleteFirebaseDoc,
} from './helper/firebase-CRUD-throwable'

// embeded in Bidding in Firestore
interface Offer {
  userId: string
  amount: number
  createdAt: Timestamp
}

function useMakeOffer() {
  const roomId = useRoomIdAtomValue()
  const [[{ id: biddingId }]] = useInProgressBiddingsAtomValue()
  const mutation = useMutation({
    mutationFn: mutateFnMakeOffer,
  })

  return [mutation]

  async function mutateFnMakeOffer(amount: number) {
    return await upcreateFirebaseDoc({
      segments: ['rooms', roomId, 'biddings', biddingId, 'offers'],
      data: {
        userId: 'user id',
        createdAt: serverTimestamp(),
      },
    })
  }
}

export type { Offer }
