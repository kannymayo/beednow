import { useNavigate } from 'react-router-dom'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

import { useJoinRoom } from '@/api/room'
import { useQueryGetBiddings } from '@/api/bidding'
import { useRoomPreviewAtom } from '@/store/useRoomAtom'
import { debouncedToast } from '@/utils/debouncedToast'
import { calRelativeDate } from '@/utils/calc-relative-date'

export default function RoomPreview() {
  const navigate = useNavigate()
  const [joinRoom] = useJoinRoom()
  const [roomPreview] = useRoomPreviewAtom({ resetOnUnmount: true })
  const roomId = roomPreview?.id
  const [queryBiddings] = useQueryGetBiddings(roomId)

  const { data: biddings } = queryBiddings
  if (!roomPreview) {
    return <></>
  }
  const {
    name,
    createdAt: { seconds },
    joinedBy,
    hostedBy,
    attendees,
  } = roomPreview
  const strRelativeDate = calRelativeDate(new Date(seconds * 1000), new Date())

  return (
    <div className="card h-full">
      <div className="card-body h-full justify-between">
        <div className="card-title grid">{name}</div>

        <div>{`biddings: ${biddings?.length}`}</div>
        <div>{`Id: ${roomId}`}</div>
        <div>{`Host: ${hostedBy}`}</div>
        <div>{`Attendees: ${joinedBy.length}`}</div>
        <div className="card-actions justify-end items-center">
          <div className="badge badge-info">{strRelativeDate}</div>
          <button
            onClick={handleJoin}
            className="btn btn-success btn-outline btn-sm gap-2"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
            Join
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
}
