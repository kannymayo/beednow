import clsx from 'clsx'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'

import { useQueryRoom } from '@/api/room'
import { useRoomPreviewAtom } from '@/store/useRoomAtom'
import { calRelativeDate } from '@/utils/calc-relative-date'

export default function RoomListItem({ roomId }: { roomId: string }) {
  const [queryRoom] = useQueryRoom({
    roomId,
  })
  const [roomUnderPreview, setRoomUnderPreview] = useRoomPreviewAtom()
  const isUnderPreview = roomUnderPreview?.id === roomId

  // queryFn can throw if Firestore has inconsistent data
  if (queryRoom.isError) {
    return <></>
  }

  let roomName, hostedBy, joinedBy, date, seconds, strRelativeDate
  if (queryRoom.isSuccess) {
    ;({
      name: roomName,
      id: roomId,
      hostedBy,
      joinedBy,
      createdAt: { seconds },
    } = queryRoom.data)
    date = new Date(seconds * 1000).toLocaleDateString()
    strRelativeDate = calRelativeDate(new Date(seconds * 1000), new Date())
  }

  const clsList = clsx(
    {
      'border-l-indigo-500 border-l-4 p-1': isUnderPreview,
    },
    'group relative grid transform-none select-none items-center gap-2 bg-slate-200 p-1 pl-3 transition-all last:border-b-0 hover:bg-slate-300 active:opacity-75 my-1 pb-2 cursor-pointer'
  )
  return (
    <div onClick={setForPreview} className={clsList}>
      {queryRoom.isLoading ? (
        <div className="flex h-12 w-full items-center justify-center">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="font-bold">{queryRoom?.data?.name}</div>
          <div className="badge badge-info tracking-tight">
            {strRelativeDate}
          </div>
          <DocumentMagnifyingGlassIcon className="text-primary invisible absolute right-2 ml-2 h-7 w-7 capitalize group-hover:visible" />
        </>
      )}
    </div>
  )

  async function setForPreview() {
    if (queryRoom.isSuccess) {
      setRoomUnderPreview(queryRoom.data)
    }
  }
}
