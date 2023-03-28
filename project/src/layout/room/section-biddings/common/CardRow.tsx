import { useState } from 'react'

import { useAtomIsRoomHost } from '@/atoms/room'

export default function CardRow({
  biddingId,
  action,
  actionHint,
  actionIcon: ActionIcon = () => <></>,
  children,
}: {
  biddingId: string
  action: (id: string) => void
  actionHint: string
  actionIcon: React.FC<{ className?: string }>
  children: React.ReactNode
}) {
  const isRoomHost = useAtomIsRoomHost().getter()
  const [isActionStaged, setIsActionStaged] = useState(false)
  return (
    <div className="flex items-center justify-between gap-1 overflow-hidden">
      {children}
      {isRoomHost ? (
        <button
          onMouseLeave={() => setIsActionStaged(false)}
          onClick={handlePriAction}
          className="btn btn-xs btn-outline hidden flex-shrink-0 border-none group-hover:flex"
        >
          {isActionStaged ? (
            <span className="font-sm font-light capitalize">
              {actionHint || 'do it'}
            </span>
          ) : (
            <ActionIcon className="h-5 w-5" />
          )}
        </button>
      ) : (
        <></>
      )}
    </div>
  )

  function handlePriAction() {
    if (isActionStaged) action(biddingId)
    else setIsActionStaged(true)
  }
}
