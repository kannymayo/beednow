import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

import { Room, useJoinRoom } from '@/api/room'
import debouncedToast from '@/utils/debouncedToast'

export default function RoomListItem({ room }: { room: Room }) {
  const navigate = useNavigate()
  const [doJoinBookKeeping] = useJoinRoom()

  return (
    <div className="relative grid transform-none items-center border-b-2 p-1 pl-3 first:rounded-t-md hover:bg-slate-200 active:opacity-75">
      <div>{room.name}</div>
      <div>
        Created:{' '}
        {new Date(room?.createdAt?.seconds * 1000).toLocaleDateString()}
      </div>
      <button
        onClick={handleJoin}
        className="btn btn-success btn-sm btn-outline absolute right-2 border-2"
      >
        Join <PaperAirplaneIcon className="ml-2 h-6 w-6" />
      </button>
    </div>
  )

  async function handleJoin() {
    try {
      await doJoinBookKeeping(room.id)
      debouncedToast(`Joining ${room.name}`, { type: 'success' })
      navigate(`/room/${room.id}`)
    } catch (err) {
      const typedErr = err as Error
      debouncedToast(`Error joining room: ${typedErr.message}`, {
        type: 'error',
      })
    }
  }
}
