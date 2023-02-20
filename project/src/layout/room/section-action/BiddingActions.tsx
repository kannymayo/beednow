import clsx from 'clsx'
import { useDebounce } from 'ahooks'
import {
  ArrowUturnUpIcon,
  HandRaisedIcon,
  BackwardIcon,
  QuestionMarkCircleIcon,
  LockOpenIcon,
  LockClosedIcon,
  RocketLaunchIcon,
  FireIcon,
} from '@heroicons/react/24/outline'

import {
  useInProgressBiddingsAtomValue,
  useCountdownAtomValue,
} from '@/store/useBiddingAtom'
import InfoModal from '@/components/InfoModal'

export default function BidAction() {
  const countdown = useCountdownAtomValue()
  const [inProgressBiddings, hasMember] = useInProgressBiddingsAtomValue()
  const hasMemberDebounced = useDebounce(hasMember, {
    wait: 200,
  })

  const globalDisabled = !hasMemberDebounced || countdown <= 0

  return (
    <div className="grid h-full w-full">
      <div className="mt-1 overflow-hidden bg-slate-100 drop-shadow-lg">
        <div className="grid h-full w-full grid-cols-2 grid-rows-6">
          {/* Top Layer */}
          <div className="col-span-2 col-start-1 row-span-3 row-start-1 flex items-stretch justify-between gap-2 px-2 xl:gap-16 xl:px-10">
            {/* TL  Relative Offer with Predicate*/}
            <div className="flex flex-grow basis-1 flex-col gap-1">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Manually bid 000</span>
                </label>
                <div className="flex flex-1 flex-col justify-around">
                  <button
                    disabled={globalDisabled}
                    className="btn btn-sm btn-primary"
                  >
                    +100
                  </button>
                  <button
                    disabled={globalDisabled}
                    className="btn btn-sm btn-primary"
                  >
                    +500
                  </button>
                  <button
                    disabled={globalDisabled}
                    className="btn btn-sm btn-primary"
                  >
                    +5000
                  </button>
                </div>
              </div>
            </div>
            {/* TR Relative Offer with Autopilot */}

            <div className="flex flex-grow basis-1 flex-col gap-1">
              <div className="form-control flex-1">
                <div className=" label">
                  <span className="label-text flex items-center gap-2">
                    Autopilot
                    <InfoModal
                      title="Autopilot Mode"
                      body="When in autopilot mode, system will automatically bid at the selected increment, until the budget is reached or the bid is won"
                    >
                      <QuestionMarkCircleIcon className="h-4 w-4 cursor-pointer" />
                    </InfoModal>
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-around">
                  <div className="input-group">
                    <span className="input-group-text flex-1 select-none">
                      +100
                    </span>
                    <button
                      disabled={globalDisabled}
                      className="btn btn-sm btn-primary gap-2 font-normal capitalize"
                    >
                      <RocketLaunchIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text flex-1 select-none">
                      +500
                    </span>
                    <button
                      disabled={globalDisabled}
                      className="btn btn-sm btn-primary gap-2 font-normal capitalize"
                    >
                      <RocketLaunchIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text flex-1 select-none">
                      +5000
                    </span>
                    <button
                      disabled={globalDisabled}
                      className="btn btn-sm btn-primary gap-2 font-normal capitalize"
                    >
                      <FireIcon className="h-5 w-5 hover:animate-bounce" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Layer, Budget */}
          <div className="col-span-2 col-start-1 row-span-1 row-start-4 flex items-end justify-center px-2 xl:px-10">
            <div className="input-group">
              <span className="input-group-text select-none gap-2">
                Budget
                <InfoModal
                  title="Setting Budget"
                  body="If a budget is set, you will be unable to bid above that amount"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4 cursor-pointer" />
                </InfoModal>
              </span>
              <input
                disabled={globalDisabled}
                className="input flex-1 focus:outline-none"
                type="text"
                placeholder="Infinity"
                size={12}
              />
              <button
                disabled={globalDisabled}
                className="btn btn-warning gap-2 capitalize"
              >
                <LockOpenIcon className="h-5 w-5" />
                Set
              </button>
            </div>
          </div>

          {/* Bottom Layer */}
          <div className="col-span-2 col-start-1 row-span-2 row-start-5 flex justify-center gap-8 px-2 xl:px-10">
            {/* BL Non-bidding Actions */}
            <div className=" flex flex-col items-center justify-center gap-2">
              <button
                disabled={globalDisabled}
                className="btn btn-warning btn-sm flex w-28 justify-around"
              >
                <HandRaisedIcon className="h-5 w-5" />
                Wait
              </button>
              <button
                disabled={globalDisabled}
                className="btn btn-warning btn-sm flex w-28 justify-around"
              >
                <BackwardIcon className="h-5 w-5" />
                Later
              </button>
            </div>

            {/* BR Absolute Offer */}
            <div className=" flex flex-1 items-center justify-center">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Submit your bid</span>
                </label>
                <label className="input-group input-group-sm">
                  <span className="input-group-text px-2">Offer</span>
                  <input
                    disabled={globalDisabled}
                    size={4}
                    type="text"
                    placeholder="Enter amount"
                    className="input input-sm flex-1 focus:outline-none"
                  />
                  <button
                    disabled={globalDisabled}
                    className="btn btn-sm btn-primary"
                  >
                    <ArrowUturnUpIcon className="h-5 w-5" />
                  </button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
