import clsx from 'clsx'
import { useState } from 'react'
import { useDebounce } from 'ahooks'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'

import { useInProgressBiddingsAtomValue } from '@/store/useBiddingAtom'
import { useIsRoomHostAtomValue } from '@/store/useRoomAtom'
import { useHighestOfferAtomValue } from '@/store/useOfferAtom'
import Countdown from './Countdown'
import StatsAndEqpEffects from './StatsAndEqpEffects'
import MetaAndWpnStats from './MetaAndWpnStats'
import HostActions from './HostActions'

export default function BidItem() {
  const MAX_COUNTDOWN = 60
  const [inProgressBiddings, hasMember] = useInProgressBiddingsAtomValue()
  const isRoomHost = useIsRoomHostAtomValue()
  const highestOffer = useHighestOfferAtomValue()
  const hasMemberDebounced = useDebounce(hasMember, {
    wait: 200,
  })
  // drives the component tree
  const [countdown, setCoundown] = useState(MAX_COUNTDOWN)

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
              <div className="stat @container grid-cols-4 grid-rows-4 gap-x-0 overflow-hidden p-2 pb-0">
                <div className="stat-figure text-secondary col-span-1 col-start-4 row-span-2 row-start-2">
                  <CurrencyDollarIcon className="@[135px]:visible invisible h-10 w-10 text-yellow-500" />
                </div>
                <div className="stat-title cols-span-4 row-span-1 select-none">
                  Currently at:
                </div>
                <div className="stat-value col-span-3 row-span-2 flex items-center">
                  {highestOffer?.amount || '0'}
                </div>
                <div className="stat-desc col-span-4 row-span-1">
                  {highestOffer?.userName || '-'}
                </div>
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
            <HostActions bidding={inProgressBidding} countdown={countdown} />
          )}
        </div>
      </div>
    </div>
  )
}
