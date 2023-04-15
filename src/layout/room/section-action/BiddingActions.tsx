import { useDebounce } from 'ahooks'

import {
  useInProgressBiddingsAtoms,
  useCountdownAtoms,
} from '@/store/useBiddingAtom'
import { useMakeOffer } from '@/api/offer'
import ActionAbsolute from './ActionAbsolute'
import ActionNonOffer from './ActionNonOffer'
import ActionSetBudget from './ActionSetBudget'
import ActionAutopilot from './ActionAutopilot'
import ActionIncrement from './ActionIncrement'

export default function BidAction() {
  const countdown = useCountdownAtoms().get()
  const [, hasMember] = useInProgressBiddingsAtoms().get()
  const hasMemberDebounced = useDebounce(hasMember, {
    wait: 200,
  })
  const [mutationMakeOffer] = useMakeOffer()

  // undebounced hasMember causes flickering when progressing to
  // the next bidding
  const globalDisabled = !hasMemberDebounced || countdown <= 0

  return (
    <div className="grid h-full w-full">
      <div className="mt-1 overflow-hidden bg-slate-100 drop-shadow-lg">
        {/* Top Grid [A1,B6] */}
        <div className="grid h-full w-full grid-cols-2 grid-rows-6">
          {/* [A1,B3] */}
          <div className="col-span-2 col-start-1 row-span-3 row-start-1 flex items-stretch justify-between gap-2 px-2 xl:gap-16 xl:px-10">
            {/* [A1,A3]  Offer incrementally with Predicate*/}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <ActionIncrement
                globalDisabled={globalDisabled}
                mutateMakeOfferAsync={mutationMakeOffer.mutateAsync}
              />
            </div>
            {/* [B1,B3] Relative Offer with Autopilot */}
            <div className="flex flex-grow basis-1 flex-col gap-1">
              <ActionAutopilot globalDisabled={globalDisabled} />
            </div>
          </div>

          {/* [A4,B4] */}
          <div className="col-span-2 col-start-1 row-span-1 row-start-4 flex items-end justify-center px-2 xl:px-10">
            <ActionSetBudget />
          </div>
          {/* [A5,B6] */}
          <div className="col-span-2 col-start-1 row-span-2 row-start-5 flex justify-between gap-8 px-2 xl:px-10">
            <ActionNonOffer globalDisabled={globalDisabled} />

            <ActionAbsolute
              globalDisabled={globalDisabled}
              mutateMakeOfferAsync={mutationMakeOffer.mutateAsync}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
