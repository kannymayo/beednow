import clsx from 'clsx'
import { useState } from 'react'
import { useDebounce } from 'ahooks'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import {
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'

import { useInProgressBiddingsAtomValue } from '@/store/useBiddingAtom'
import {
  useMutationResetBidding,
  useMutationGrantMoreTime,
} from '@/api/bidding'
import { useIsRoomHostAtomValue } from '@/store/useRoomAtom'
import InfoModal from '@/components/InfoModal'
import Countdown from './Countdown'
import StatsAndEqpEffects from './StatsAndEqpEffects'
import MetaAndWpnStats from './MetaAndWpnStats'
import RequiresConfirmByModal from '@/components/RequiresConfirmByModal'

export default function BidItem() {
  const MAX_COUNTDOWN = 60
  const [mutationReset] = useMutationResetBidding()
  const [mutationGrantMoreTime] = useMutationGrantMoreTime()
  const [inProgressBiddings, hasMember] = useInProgressBiddingsAtomValue()
  const isRoomHost = useIsRoomHostAtomValue()
  const hasMemberDebounced = useDebounce(hasMember, {
    wait: 200,
  })
  const [countdown, setCoundown] = useState(MAX_COUNTDOWN)

  const canGrantMoreTime = countdown <= MAX_COUNTDOWN - 10
  const inProgressBidding = inProgressBiddings[0]
  const name = inProgressBidding?.details?.name
  const iconUrl = inProgressBidding?.details?.iconUrl
  const type = inProgressBidding?.details?.type
  const slot = inProgressBidding?.details?.slot
  const itemLevel = inProgressBidding?.details?.itemLevel
  const primaryStats = inProgressBidding?.details?.primaryStats
  const secondaryStats = inProgressBidding?.details?.secondaryStats
  const equipEffects = inProgressBidding?.details?.equipEffects
  const usableClasses = inProgressBidding?.details?.usableClasses
  const weaponProps = inProgressBidding?.details?.weaponProps
  const endsAt = inProgressBidding?.endsAt
  const pausedAt = inProgressBidding?.pausedAt
  const isPaused = inProgressBidding?.isPaused
  const isEnded = inProgressBidding?.isEnded

  return (
    <div className="grid h-full w-full">
      <div
        className={clsx(
          {
            'requires-inprogress-bidding': !hasMemberDebounced,
          },
          'm-1 mb-0 overflow-hidden bg-slate-100 drop-shadow-lg'
        )}
      >
        <div className="grid h-full w-full grid-cols-3 grid-rows-3">
          {/* [A1,C1] Name, Bidding Info, Image, Countdown */}
          <div className="col-span-3 col-start-1 row-span-1 row-start-1">
            <div className="stats h-full w-full grid-cols-3 overflow-hidden rounded-none shadow">
              {/* Left: Name, Icon */}
              <div className="stat overflow-hidden p-2 pb-0">
                <div
                  className="stat-title h-10 whitespace-normal font-bold leading-5 opacity-100"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {hasMember ? name : 'No item is being bid on'}
                </div>
                <div className="stat-value flex gap-1">
                  <div
                    style={{
                      backgroundImage: `url(${iconUrl})`,
                    }}
                    className="bg-loading h-14 w-14 rounded"
                  ></div>
                  {/* Item Level */}
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <div className="select-none text-sm opacity-70">
                      {hasMember ? 'Item Level' : ''}
                    </div>
                    <div className="font-md text-base">{itemLevel}</div>
                  </div>
                </div>
              </div>

              {/* Middle: Current Highest */}
              <div className="stat gap-x-0 overflow-hidden p-2 pb-0">
                <div className="stat-figure text-secondary">
                  <CurrencyDollarIcon className="h-10 w-10 text-yellow-500" />
                </div>
                <div className="stat-title select-none">Currently at:</div>
                <div className="stat-value">4,200</div>
                <div className="stat-desc">User Name</div>
              </div>

              {/* Right: Countdown */}
              <div className="stat overflow-hidden p-2 pb-0">
                <Countdown
                  max={MAX_COUNTDOWN}
                  isEnded={isEnded}
                  isPaused={isPaused}
                  endsAt={endsAt}
                  pausedAt={pausedAt}
                  updateSubscriberCountdown={setCoundown}
                />
                {/* <div className="stat-desc">Countdown</div> */}
                <div className="stat-desc select-none">Countdown</div>
              </div>
            </div>
          </div>

          {/* [A2, B2] Meta, Weapon stats */}
          <div className="col-span-2 col-start-1 row-span-1">
            <MetaAndWpnStats
              isAnyInProgress={hasMember}
              meta={{
                type,
                slot,
                usableClasses,
              }}
              weaponProps={weaponProps}
            />
          </div>

          {/* [A3,C3] primary/secondary stats, and equipe ffects */}
          <div className="col-span-3 col-start-1 row-span-1 row-start-3">
            <StatsAndEqpEffects
              isAnyInProgress={hasMember}
              priStats={primaryStats}
              secStats={secondaryStats}
              equipEffects={equipEffects}
            />
          </div>

          {/* [C2] Host Actions */}
          {isRoomHost && (
            <div className="col-span-1 col-start-3 row-span-1 row-start-2 ">
              <div className="flex h-full w-full flex-col items-stretch justify-center gap-2 px-4">
                <div className="flex items-center justify-around">
                  <span className="select-none text-sm opacity-70">
                    Host Actions
                  </span>
                  <InfoModal
                    title="Host Actions"
                    body="As host, you have unlimited access to these 2 actions: reset, or grant more time to the bidding (even after the bidding is ended)"
                  >
                    <QuestionMarkCircleIcon className="ml-auto h-4 w-4 cursor-pointer" />
                  </InfoModal>
                </div>
                <RequiresConfirmByModal
                  title="Are you sure you want to reset the bidding?"
                  body="This will reset the bidding to its initial state and wipe all bidding history, and will also reset the countdown to half the initial value."
                  onConfirm={handleResetBidding}
                >
                  <div className="btn btn-sm btn-warning w-full flex-nowrap justify-start gap-3 truncate capitalize">
                    <ArrowPathIcon className="h-6 w-6 shrink-0" />
                    Reset
                  </div>
                </RequiresConfirmByModal>
                <button
                  disabled={!canGrantMoreTime}
                  onClick={handleGrantMoreTime}
                  className="btn btn-sm btn-warning w-full flex-nowrap justify-start gap-3 truncate capitalize"
                >
                  <PlusCircleIcon className="h-6 w-6 shrink-0" />
                  10s More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  async function handleResetBidding() {
    await mutationReset.mutateAsync({
      biddingId: inProgressBidding.id,
      initialCountdown: MAX_COUNTDOWN / 2,
    })
  }

  async function handleGrantMoreTime() {
    await mutationGrantMoreTime.mutateAsync({
      biddingId: inProgressBidding.id,
      seconds: 10,
      base: inProgressBidding.endsAt,
    })
  }
}
