import clsx from 'clsx'
import { useDebounce } from 'ahooks'

import { useInProgressBiddingsAtoms } from '@/store/useBiddingAtom'
import { useIsRoomHostAtoms } from '@/store/useRoomAtom'
import HeaderSummary from './HeaderSummary'
import HeaderCurrentHighest from './HeaderCurrentHighest'
import HeaderCountdown from './HeaderCountdown'
import StatsAndEqpEffects from './StatsAndEqpEffects'
import MetaAndWpnStats from './MetaAndWpnStats'
import HostActions from './HostActions'

export default function BidItem() {
  const MAX_COUNTDOWN = 60
  const [inProgressBiddings, hasMember] = useInProgressBiddingsAtoms().get()
  const isRoomHost = useIsRoomHostAtoms().get()
  const hasMemberDebounced = useDebounce(hasMember, {
    wait: 200,
  })

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
  const endsAtMillis = inProgressBidding?.endsAt?.toMillis()
  const pausedAtMillis = inProgressBidding?.pausedAt?.toMillis()
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
              <HeaderSummary
                hasMember={hasMember}
                name={name}
                iconUrl={iconUrl}
                itemLevel={itemLevel}
              />
              <HeaderCurrentHighest />
              <HeaderCountdown
                biddingId={inProgressBidding?.id}
                max={MAX_COUNTDOWN}
                isEnded={isEnded}
                isPaused={isPaused}
                endsAtMillis={endsAtMillis}
                pausedAtMillis={pausedAtMillis}
              />
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
          {isRoomHost && <HostActions bidding={inProgressBidding} />}
        </div>
      </div>
    </div>
  )
}
