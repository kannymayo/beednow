export default function RoomCard({
  details,
}: {
  details: {
    name: string
    _id: string
    createdAt: any
  }
}) {
  const { name } = details
  const id = details._id
  const dateStr = new Date(
    details.createdAt.seconds * 1000
  ).toLocaleDateString()

  return (
    <li className="grid h-32 grid-cols-6 grid-rows-4 rounded-md border-2 bg-white p-2">
      <div className="col-span-6 truncate border-b-2">{name}</div>
      <div className="col-span-4 col-end-7 row-start-4 flex items-center justify-center">
        <div className="badge badge-info ">{dateStr}</div>
      </div>
    </li>
  )
}
