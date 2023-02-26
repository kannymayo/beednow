import { useAutoAnimate } from '@formkit/auto-animate/react'

import { useFinishedBiddingsAtoms } from '@/store/useBiddingAtom'
import BiddingItem from './common/BiddingItem'

export default function BiddingsFinished() {
  const [animationParent] = useAutoAnimate()
  const biddings = useFinishedBiddingsAtoms().get()

  return (
    <ul className="px-1" ref={animationParent}>
      {biddings?.map &&
        biddings.map((item) => <BiddingItem item={item} key={item.id} />)}
    </ul>
  )
}
