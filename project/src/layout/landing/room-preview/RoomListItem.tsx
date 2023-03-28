import clsx from 'clsx'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'

import { useAsyncAtomRoom } from '@/store/useRoomAtom'
import { useAtomRoomIdPreview } from '@/store/useRoomAtom'
import { calRelativeDate } from '@/utils/calc-relative-date'

export default function RoomListItem({ roomId }: { roomId: string }) {
  const room = useAsyncAtomRoom({
    roomId,
  }).getter()
  const [roomIdPreview, setRoomIdPreview] = useAtomRoomIdPreview().tuple()
  const isUnderPreview = roomIdPreview === roomId

  const {
    name: roomName,
    createdAt: { seconds },
  } = room
  const strRelativeDate = calRelativeDate(new Date(seconds * 1000), new Date())

  const clsList = clsx(
    {
      'border-l-indigo-500 border-l-4 p-1': isUnderPreview,
    },
    'group relative grid transform-none select-none items-center gap-2 bg-slate-200 p-1 pl-3 transition-all last:border-b-0 hover:bg-slate-300 active:opacity-75 my-1 pb-2 cursor-pointer'
  )
  return (
    <div onClick={setForPreview} className={clsList}>
      <div className="font-bold">{roomName}</div>
      <div className="badge badge-info tracking-tight">{strRelativeDate}</div>
      <DocumentMagnifyingGlassIcon className="text-primary invisible absolute right-2 ml-2 h-7 w-7 capitalize group-hover:visible" />
    </div>
  )

  async function setForPreview() {
    setRoomIdPreview(roomId)
  }
}
