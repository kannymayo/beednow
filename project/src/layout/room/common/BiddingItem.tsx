import { useState } from 'react'
import {
  TrashIcon,
  XMarkIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline'

import { useIsRoomHostAtom } from '@/store/useRoomAtom'
import { Bidding } from '@/api/bidding'
import clsx from 'clsx'

export default function BiddingItem({
  item,
  mutateDeleteAsync,
  mutateStartBiddingAsync,
}: {
  item: Bidding
  mutateDeleteAsync: (id: string) => Promise<void>
  mutateStartBiddingAsync: (id: string) => Promise<void>
}) {
  const [isRoomHost] = useIsRoomHostAtom()
  const [isDeleteStaged, setIsDeleteStaged] = useState(false)

  const {
    id,
    details: { name, iconUrl, type, slot, itemLevel, id: itemId },
    isInProgress,
  } = item
  return (
    <li key={id}>
      <div
        className={clsx(
          { 'shadow ring-2 ring-rose-800': isInProgress },
          'card card-side group my-1 overflow-hidden rounded-md bg-slate-300  py-0 hover:bg-slate-400'
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
        <div className="card-body grid gap-0  px-1 py-0">
          {/* Row of name + action */}
          <div className="flex items-center justify-between overflow-hidden">
            {/* Name */}
            <div className="min-w-0 flex-1 truncate text-sm font-medium">
              {name}
            </div>
            {/* Only visible to host */}
            {isRoomHost ? (
              <>
                {/* Delete button */}
                <button
                  onMouseLeave={() => setIsDeleteStaged(false)}
                  onClick={handleDelete}
                  className="btn btn-xs btn-outline hidden border-none group-hover:flex"
                >
                  {isDeleteStaged ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <TrashIcon className="h-5 w-5" />
                  )}
                </button>
              </>
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
            <button
              onClick={handleStartBidding}
              className="btn btn-xs btn-outline hidden border-none  group-hover:flex"
            >
              <PlayCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )

  async function handleDelete() {
    if (isDeleteStaged) {
      mutateDeleteAsync(item.id)
    } else {
      setIsDeleteStaged(true)
    }
  }

  async function handleStartBidding() {
    await mutateStartBiddingAsync(item.id)
  }
}
