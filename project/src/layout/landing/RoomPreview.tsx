import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  PaperAirplaneIcon,
  TrashIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline'

import { useJoinRoom, useIsSelfHosted, useMutationDeleteRoom } from '@/api/room'
import { useQueryGetBiddings } from '@/api/bidding'
import { useRoomPreviewAtom } from '@/store/useRoomAtom'
import { debouncedToast } from '@/utils/debouncedToast'
import { calRelativeDate } from '@/utils/calc-relative-date'

export default function RoomPreview() {
  const navigate = useNavigate()
  const [joinRoom] = useJoinRoom()
  const [roomUnderPreview, setRoomUnderPreview] = useRoomPreviewAtom({
    resetOnUnmount: true,
  })
  const [isSelfHosted] = useIsSelfHosted(roomUnderPreview?.hostedBy)
  const [queryBiddings] = useQueryGetBiddings(roomUnderPreview?.id)
  const [{ mutateAsync: mutateAsyncDeleteRoom }] = useMutationDeleteRoom()
  const [isPreviewDiabled, setIsPreviewDisabled] = useState(false)

  // early return when no room is under preview
  const { data: biddings } = queryBiddings
  if (!roomUnderPreview) {
    return <></>
  }

  // retrieve room info
  const {
    id: roomId,
    name,
    createdAt: { seconds },
    joinedBy,
    hostedBy,
    attendees,
  } = roomUnderPreview
  const strRelativeDate = calRelativeDate(new Date(seconds * 1000), new Date())

  const clsTop = clsx(
    {
      'opacity-50 pointer-events-none': isPreviewDiabled,
    },
    'card h-full'
  )
  return (
    <div className={clsTop}>
      <div className="card-body h-full justify-between p-4">
        <div className="card-title grid">{name}</div>
        <div>{`Id: ${roomId}`}</div>
        <div>{`Host: ${hostedBy}`}</div>
        <div>{`Attendees: ${joinedBy?.length}`}</div>
        <div className="flex justify-end gap-2">
          <div className="badge badge-info badge-lg h-8 gap-1 drop-shadow-lg">
            <ShoppingCartIcon className="h-5 w-5" />
            {`biddings: ${biddings?.length}`}
          </div>
          <div className="badge badge-info badge-lg h-8 gap-1 drop-shadow-lg">
            <CalendarDaysIcon className="h-5 w-5" />
            {strRelativeDate}
          </div>
        </div>
        <div className="card-actions items-center justify-end">
          {isSelfHosted && (
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline btn-sm gap-2 border-2 shadow-md"
            >
              Delete
              <TrashIcon className="h-6 w-6" />
            </button>
          )}
          <button
            onClick={handleJoin}
            className="btn btn-success btn-outline btn-sm gap-2 border-2 shadow-md"
          >
            Join
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )

  async function handleJoin() {
    try {
      await joinRoom(roomId)
      navigate(`/room/${roomId}`)
      debouncedToast(`Joining room: ${name}`, {
        type: 'success',
      })
    } catch (e) {
      const err = e as Error
      debouncedToast(err.message, {
        type: 'error',
      })
    }
  }

  async function handleDelete() {
    setIsPreviewDisabled(true)
    await Promise.allSettled([
      mutateAsyncDeleteRoom(roomId),
      new Promise((resolve) => setTimeout(resolve, 750)),
    ])
    setIsPreviewDisabled(false)
    setRoomUnderPreview(null)
  }
}
