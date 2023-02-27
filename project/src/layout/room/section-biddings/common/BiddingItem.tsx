import clsx from 'clsx'
import { TrophyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

import { Bidding } from '@/api/bidding'
import CardRow from './CardRow'

export default function BiddingItem({
  item,
  priAction,
  priActionHint,
  priActionIcon = () => <></>,
  secAction,
  secActionHint,
  secActionIcon = () => <></>,
}: {
  item: Bidding
  priAction: (id: string) => void
  priActionHint: string
  priActionIcon: React.FC<{ className?: string }>
  secAction: (id: string) => void
  secActionHint: string
  secActionIcon: React.FC<{ className?: string }>
}) {
  const {
    id,
    details: { name, iconUrl, type, slot, itemLevel, id: itemId },
    isInProgress,
  } = item

  const clsCardProper = clsx(
    {
      'pr-1 before:w-1': isInProgress,
      'before:w-0': !isInProgress,
    },
    'card card-side group my-1 overflow-hidden rounded-sm bg-slate-300 py-0 before:absolute before:right-0 before:h-full before:bg-rose-500 hover:bg-slate-400'
  )
  return (
    <li key={id} className="relative">
      <div className={clsCardProper}>
        {/* Icon */}
        <figure className="flex-shrink-0">
          <a
            className="h-13 w-13"
            href="#"
            data-wowhead={`item=${itemId}&domain=wrath`}
          >
            <img src={iconUrl} />
          </a>
        </figure>
        <div className="card-body grid grid-rows-2 gap-0 px-1 py-0">
          <CardRow
            biddingId={id}
            action={priAction}
            actionHint={priActionHint}
            actionIcon={priActionIcon}
          >
            <div className="min-w-0 flex-1 truncate text-sm font-medium">
              {name}
            </div>
          </CardRow>
          <CardRow
            biddingId={id}
            action={secAction}
            actionHint={secActionHint}
            actionIcon={secActionIcon}
          >
            <div className="mr-auto flex min-w-0 gap-1 ">
              {item.hasClosingOffer ? (
                // show closing offer amount and user
                <div className="input-group-xs input-group flex flex-shrink select-none overflow-hidden">
                  <div className="input input-xs flex items-center text-yellow-700">
                    <TrophyIcon className="h-4 w-4" />
                  </div>
                  <span className="px-1 font-bold">{item.closingAmount}</span>
                  <div className="input input-xs flex items-center text-slate-400">
                    {(function () {
                      const uname = item.closingUsername
                      const idx = uname.indexOf('@')
                      return uname.slice(0, idx)
                    })()}
                  </div>
                </div>
              ) : item.isEnded ? (
                // no closing offer, but closed
                <div className="input-group input-group-xs">
                  <div className="input input-xs flex items-center text-yellow-700">
                    <ExclamationCircleIcon className="h-4 w-4" />
                  </div>
                  <span className="pl-1 font-bold">failed</span>
                </div>
              ) : (
                // no closing offer, not closed
                <>
                  <div className="badge shrink-0 rounded-sm px-1">
                    {type ?? slot}
                  </div>
                  <div className="badge shrink-0 rounded-sm px-1">
                    ilvl: {itemLevel}
                  </div>
                </>
              )}
            </div>
          </CardRow>
        </div>
      </div>
    </li>
  )
}
