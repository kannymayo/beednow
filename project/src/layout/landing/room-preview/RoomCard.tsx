import { useQueryGetRoom, Room } from '@/api/room'

export default function RoomCard({ roomId }: { roomId: string }) {
  const [queryRoom, queryKeyRoom] = useQueryGetRoom(roomId)

  return (
    <li className="grid h-32 grid-cols-6 grid-rows-4 rounded-md border-2 bg-white p-2">
      {/* loading state cannot be trusted as of curren implementation */}
      {queryRoom?.data?.name ? (
        <>
          <div className="col-span-6 truncate border-b-2">
            {queryRoom?.data?.name}
          </div>
          <div className="col-span-4 col-end-7 row-start-4 flex items-center justify-center">
            <div className="badge badge-info ">
              {new Date(
                queryRoom?.data?.createdAt?.seconds * 1000
              ).toLocaleDateString()}
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </li>
  )
}
