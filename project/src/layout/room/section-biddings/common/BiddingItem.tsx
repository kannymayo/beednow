import { useState } from 'react'
import clsx from 'clsx'

import { useIsRoomHostAtoms } from '@/store/useRoomAtom'
import { Bidding } from '@/api/bidding'

export default function BiddingItem({
  item,
  priAction,
  priActionHint,
  priActionIcon: PriActionIcon = () => <></>,
  secAction,
  secActionHint,
  secActionIcon: SecActionIcon = () => <></>,
}: {
  item: Bidding
  priAction: (id: string) => void
  priActionHint: string
  priActionIcon: React.FC<{ className?: string }>
  secAction: (id: string) => void
  secActionHint: string
  secActionIcon: React.FC<{ className?: string }>
}) {
  const isRoomHost = useIsRoomHostAtoms().get()
  const [isPriActionStaged, setIsPriActionStaged] = useState(false)
  const [isSecActionStaged, setIsSecActionStaged] = useState(false)

  const {
    id,
    details: { name, iconUrl, type, slot, itemLevel, id: itemId },
    isInProgress,
  } = item
  return (
    <li key={id} className="relative">
      <div
        className={clsx(
          {
            'pr-1 before:w-1': isInProgress,
            'before:w-0': !isInProgress,
          },
          'card card-side group my-1 overflow-hidden rounded-sm bg-slate-300 py-0 before:absolute before:right-0 before:h-full before:bg-rose-500 hover:bg-slate-400'
        )}
      >
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
        <div className="card-body grid gap-0 px-1 py-0">
          {/* Row of name + action */}
          <div className="flex items-center justify-between overflow-hidden">
            {/* Name */}
            <div className="min-w-0 flex-1 truncate text-sm font-medium">
              {name}
            </div>
            {/* Only visible to host */}
            {/* Primary button */}
            {isRoomHost ? (
              <button
                onMouseLeave={() => setIsPriActionStaged(false)}
                onClick={handlePriAction}
                className="btn btn-xs btn-outline hidden border-none group-hover:flex"
              >
                {isPriActionStaged ? (
                  <span className="font-sm font-light capitalize">
                    {priActionHint || 'do it'}
                  </span>
                ) : (
                  <PriActionIcon className="h-5 w-5" />
                )}
              </button>
            ) : (
              <></>
            )}
          </div>
          {/* Row of tags */}
          <div className="card-actions flex-nowrap items-center justify-around">
            <div className="mr-auto flex min-w-0 gap-1 ">
              <div className="badge badge-primary shrink-0">{type ?? slot}</div>
              <div className="badge badge-primary shrink-0">
                ilvl: {itemLevel}
              </div>
            </div>
            {/* Start bidding button */}
            {isRoomHost ? (
              <button
                onMouseLeave={() => setIsSecActionStaged(false)}
                onClick={handleSecAction}
                className="btn btn-xs btn-outline hidden border-none  group-hover:flex"
              >
                {isSecActionStaged ? (
                  <span className="font-sm font-light capitalize">
                    {secActionHint || 'do it'}
                  </span>
                ) : (
                  <SecActionIcon className="h-5 w-5" />
                )}
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </li>
  )

  function handlePriAction() {
    if (isPriActionStaged) priAction(item.id)
    else setIsPriActionStaged(true)
  }

  function handleSecAction() {
    if (isSecActionStaged) secAction(item.id)
    else setIsSecActionStaged(true)
  }
}
