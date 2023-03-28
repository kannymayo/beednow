import { useState, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  PaperAirplaneIcon,
  TrashIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline'

import { useJoinRoom, useMutationDeleteRoom } from '@/api/room'
import { useQueryBiddings } from '@/api/bidding'
import { useAsyncAtomRoomPreview, useAtomRoomIdPreview } from '@/atoms/room'
import { useUserAtoms } from '@/atoms/user'
import { toasto } from '@/utils/toasto'
import { calRelativeDate } from '@/utils/calc-relative-date'
import RequiresConfirmByModal from '@/components/RequiresConfirmByModal'

export default function SuspenseRoomPreview() {
  // forces a refresh, coz suspended component won't react to atom changes
  const refresher = useAtomRoomIdPreview().getter()
  return (
    <Suspense fallback={<RoomPreviewPlaceholder />}>
      <RoomPreview />
    </Suspense>
  )
}

function RoomPreviewPlaceholder() {
  return (
    <div className="card h-full">
      <div className="card-body h-full justify-between p-4">
        <div className="text-slate-600">
          To preview, type the room ID or click on a room in the list.
        </div>
      </div>
    </div>
  )
}

function RoomPreview() {
  const roomUnderPreview = useAsyncAtomRoomPreview().getter()
  const setRoomIdPreview = useAtomRoomIdPreview().setter()
  const navigate = useNavigate()
  const [joinRoom] = useJoinRoom()
  const [user] = useUserAtoms().get()
  const [queryBiddings] = useQueryBiddings(roomUnderPreview?.id)
  const [{ mutateAsync: mutateAsyncDeleteRoom }] = useMutationDeleteRoom()
  const [isPreviewDiabled, setIsPreviewDisabled] = useState(false)

  const isHostedByMe = roomUnderPreview?.hostedBy === user?.uid
  // retrieve biddings info
  const { data: dataBiddings, isLoading: isLoadingBiddings } = queryBiddings

  // early return when no room is under preview, or biddings info is loading
  // prevents flashing of empty room preview
  if (!roomUnderPreview || isLoadingBiddings) {
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
        {/* Badges for details biddings */}
        <div className="flex flex-wrap justify-end gap-2">
          <div className="badge badge-info badge-lg h-8 gap-1 drop-shadow-lg">
            <ShoppingCartIcon className="h-5 w-5" />
            {`biddings: ${dataBiddings?.length}`}
          </div>
          <div className="badge badge-info badge-lg h-8 gap-1 drop-shadow-lg">
            <CalendarDaysIcon className="h-5 w-5" />
            {strRelativeDate}
          </div>
        </div>
        {/* Buttons for joining or deleting */}
        <div className="card-actions flex-wrap items-center justify-between">
          {isHostedByMe && (
            <RequiresConfirmByModal
              title="Confirm Delete"
              body="Are you sure you want to delete this room?"
              onConfirm={handleDelete}
            >
              <div className="btn btn-error btn-outline btn-sm gap-2 border-2 shadow-md">
                Delete <TrashIcon className="h-6 w-6" />
              </div>
            </RequiresConfirmByModal>
          )}
          <button
            onClick={handleJoin}
            className="btn btn-success btn-outline btn-sm ml-auto gap-2 border-2 shadow-md"
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
      toasto(`Joining room: ${name}`, {
        type: 'success',
      })
    } catch (e) {
      const err = e as Error
      toasto(err.message, {
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
    setRoomIdPreview('')
  }
}
