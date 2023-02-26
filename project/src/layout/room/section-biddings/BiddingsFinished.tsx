import { useMemo, useRef } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { useForm } from '@/hooks/form'
import { useSignalScrolledTooDeep } from '@/hooks/useSignalScrolledTooDeep'
import {
  useMutationDeleteItem,
  useMutationResetBidding,
  useQueryBiddings,
  Bidding,
} from '@/api/bidding'
import { useRoomIdAtoms } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtoms } from '@/store/useBiddingAtom'
import { factoryCompareNewerfirst } from '@/utils/factory-compare-newerfirst'
import BiddingItem from '../common/BiddingItem'

export default function BiddingsFinished() {
  return <></>
}
