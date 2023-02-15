import { useState } from 'react'
import {
  TrashIcon,
  XMarkIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline'

import { useIsRoomHostAtom } from '@/store/useRoomAtom'
import {
  Bidding,
  useMutationDeleteItem,
  useMutationStartBidding,
} from '@/api/bidding'
import clsx from 'clsx'

export default function BiddingItem({ item }: { item: Bidding }) {
  const [isRoomHost] = useIsRoomHostAtom()
  const [isDeleteStaged, setIsDeleteStaged] = useState(false)
  const [{ mutateAsync: mutateDeleteAsync }] = useMutationDeleteItem()
  const [{ mutateAsync: mutateStartBiddingAsync }] = useMutationStartBidding()

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
          'card card-side group my-1 rounded-md bg-slate-300 py-0  hover:bg-slate-400'
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
        <div className="card-body gap-0 overflow-hidden p-1 ">
          {/* Row of name + action */}
          <div className="flex items-center justify-between ">
            {/* Name */}
            <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
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
          <div className="card-actions flex-1 flex-nowrap items-center justify-around">
            <div className="mr-auto flex gap-1">
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
