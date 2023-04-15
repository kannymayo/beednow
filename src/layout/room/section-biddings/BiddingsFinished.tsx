import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  ArrowPathRoundedSquareIcon,
  ReceiptRefundIcon,
} from '@heroicons/react/24/outline'

import { useMutationRestoreBidding } from '@/api/bidding'
import { useFinishedBiddingsAtoms } from '@/store/useBiddingAtom'
import BiddingItem from './common/BiddingItem'

export default function BiddingsFinished() {
  const [animationParent] = useAutoAnimate()
  const [{ mutateAsync: mutateRestoreBiddingAsync }] =
    useMutationRestoreBidding()
  const biddings = useFinishedBiddingsAtoms().get()

  return (
    <ul
      className="subtle-scrollbar mt-1 overflow-auto px-1"
      ref={animationParent}
    >
      {biddings?.map &&
        biddings.map((item) => (
          <BiddingItem
            item={item}
            key={item.id}
            priAction={resetCallback}
            priActionHint="reset"
            priActionIcon={ReceiptRefundIcon}
            secAction={cardSecondaryAction}
            secActionHint="restore"
            secActionIcon={ArrowPathRoundedSquareIcon}
          />
        ))}
    </ul>
  )

  async function resetCallback(id: string) {
    mutateRestoreBiddingAsync({
      id,
      willWipeHistory: true,
    })
  }
  async function cardSecondaryAction(id: string) {
    mutateRestoreBiddingAsync({ id })
  }
}
