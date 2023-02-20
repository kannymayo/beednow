import { useState } from 'react'
import clsx from 'clsx'
import {
  TrashIcon,
  XMarkIcon,
  PlayCircleIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import { UseMutationResult } from '@tanstack/react-query'

import { useIsRoomHostAtom } from '@/store/useRoomAtom'
import { Bidding, useMutationResetBidding } from '@/api/bidding'

// Thanks, ChatGPT
type MutateFnParams = ReturnType<
  typeof useMutationResetBidding
>[0] extends UseMutationResult<unknown, unknown, infer T, unknown>
  ? T
  : never

export default function BiddingItem({
  item,
  mutateDeleteAsync,
  mutateResetBiddingAsync,
}: {
  item: Bidding
  mutateDeleteAsync: (id: string) => Promise<void>
  mutateResetBiddingAsync: (o: MutateFnParams) => Promise<void>
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
          {
            'ring-2 ring-rose-700 transition-shadow duration-500 ease-in':
              isInProgress,
          },
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
            {isRoomHost && !isInProgress ? (
              <button
                onClick={handleStartBidding}
                className="btn btn-xs btn-outline hidden border-none  group-hover:flex"
              >
                <PlayCircleIcon className="h-5 w-5 -rotate-90" />
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        {isInProgress ? (
          // animate-bounce when countdown starats
          <div className="flex scale-100 items-center px-1 text-rose-700 transition-all">
            <BoltIcon className="h-10 w-10" />
          </div>
        ) : (
          <></>
        )}
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
    await mutateResetBiddingAsync({ biddingId: item.id })
  }
}
