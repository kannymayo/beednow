import 'allotment/dist/style.css'
import { Allotment } from 'allotment'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

import BiddingsPending from './BiddingsPending'
import BiddingsFinished from './BiddingsFinished'

export default function SplitPane() {
  return (
    <Allotment vertical={true} defaultSizes={[2, 1]}>
      <div className="flex h-full flex-col">
        <BiddingsPending />
      </div>
      <div className="flex h-full flex-col">
        <div className="relative h-4 shrink-0 select-none">
          <div className="absolute bottom-[-2px] z-50 flex w-full items-center justify-center gap-1 bg-rose-500 text-sm text-slate-100">
            <ShoppingBagIcon className="h-4 w-4" />
            Finished
          </div>
        </div>
        <BiddingsFinished />
      </div>
    </Allotment>
  )
}
