import { useState } from 'react'
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { useIsRoomHostAtom } from '@/store/useRoomAtom'
import { Bidding, useMutationDeleteItem } from '@/api/bidding'

export default function BiddingItem({ item }: { item: Bidding }) {
  const [isDeleteStaged, setIsDeleteStaged] = useState(false)
  const [isRoomHost] = useIsRoomHostAtom()
  const [{ mutateAsync: mutateDeleteAsync }] = useMutationDeleteItem()

  return (
    <li key={item.id}>
      <div className="card card-side group my-1 rounded-md bg-slate-300 py-0 hover:bg-slate-400">
        {/* Icon */}
        <figure className="flex-shrink-0">
          <a
            className="h-13 w-13"
            href="#"
            data-wowhead={`item=${item.details.id}&domain=wrath`}
          >
            <img src={item.details.iconUrl} />
          </a>
        </figure>
        <div className="card-body gap-0 overflow-hidden p-1 ">
          {/* Row of name + action */}
          <div className="flex items-center justify-between ">
            <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
              {item.details.name}
            </div>
            {/* Delete button only visible to host */}
            {isRoomHost ? (
              <button
                onMouseLeave={() => setIsDeleteStaged(false)}
                onClick={handleDelete}
                className="btn btn-xs btn-outline invisible border-none border-slate-500 group-hover:visible"
              >
                {isDeleteStaged ? (
                  <XMarkIcon className="h-4 w-4" />
                ) : (
                  <TrashIcon className="h-4 w-4" />
                )}
              </button>
            ) : (
              <></>
            )}
          </div>
          {/* Row of tags */}
          <div className="card-actions flex-1 flex-nowrap items-center">
            <div className="badge badge-primary shrink-0">
              {item.details.type ?? item.details.slot}
            </div>
            <div className="badge badge-primary shrink-0">
              ilvl: {item.details.itemLevel}
            </div>
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
}
