import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'

import { useQueryGetRoom } from '@/api/room'
import { useRoomPreviewAtom } from '@/store/useRoomAtom'

export default function RoomListItem({ roomId }: { roomId: string }) {
  const [queryRoom] = useQueryGetRoom(roomId)
  const [, setRoom] = useRoomPreviewAtom()

  let roomName, hostedBy, joinedBy, createdAt, date
  if (queryRoom.isSuccess) {
    let {
      name: roomName,
      id: roomId,
      hostedBy,
      joinedBy,
      createdAt: { seconds },
    } = queryRoom.data
    date = new Date(seconds * 1000).toLocaleDateString()
  }

  return (
    <div className="group relative grid transform-none select-none items-center gap-2 border-b-2 p-1 pl-3 first:rounded-t-md hover:bg-slate-200 active:opacity-75">
      {queryRoom.isLoading ? (
        <div className="flex h-12 w-full items-center justify-center">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="font-bold">{queryRoom?.data?.name}</div>
          <div className="tracking-tight">{`Created: ${date}`}</div>
          <button
            onClick={handleView}
            className="btn btn-success btn-sm btn-outline invisible absolute right-2 border-2 group-hover:visible"
          >
            View <DocumentMagnifyingGlassIcon className="ml-2 h-6 w-6" />
          </button>
        </>
      )}
    </div>
  )

  async function handleView() {
    if (queryRoom.isSuccess) {
      setRoom(queryRoom.data)
    }
  }
}
