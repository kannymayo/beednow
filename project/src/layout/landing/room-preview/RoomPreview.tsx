import { useNavigate } from 'react-router-dom'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

import { useJoinRoom } from '@/api/room'
import { useQueryGetBiddings } from '@/api/bidding'
import { useRoomPreviewAtom } from '@/store/useRoomAtom'
import toast from '@/utils/debouncedToast'

export default function RoomPreview() {
  const navigate = useNavigate()
  const [joinRoom] = useJoinRoom()
  const [roomPreview] = useRoomPreviewAtom({ resetOnUnmount: true })
  const roomId = roomPreview?.id
  const queryBiddings = useQueryGetBiddings(roomId)

  if (!roomPreview) {
    return <></>
  }
  let {
    name,
    createdAt: { seconds },
    joinedBy,
    hostedBy,
    attendees,
  } = roomPreview

  return (
    <div className="card h-full">
      <div className="card-body h-full justify-between">
        <div className="card-title">{name}</div>
        {`Id: ${roomId}`}
        {`biddings: ${queryBiddings?.data?.length}`}
        <div className="card-actions justify-end">
          <button onClick={handleJoin} className="btn btn-success gap-2">
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
      toast(`Joining room: ${name}`, {
        type: 'success',
      })
    } catch (e) {
      const err = e as Error
      toast(err.message, {
        type: 'error',
      })
    }
  }
}
