import { Bidding } from '@/api/bidding'

export default function ({ item }: { item: Bidding }) {
  const icon = (
    <figure className="flex-shrink-0">
      <a
        className="h-13 w-13"
        href="#"
        data-wowhead={`item=${item.details.id}&domain=wrath`}
      >
        <img src={item.details.iconUrl} />
      </a>
    </figure>
  )

  const rowNameAndAction = (
    <div className="flex items-center justify-between ">
      <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
        {item.details.name}
      </div>
      <button className="btn btn-xs font-light">P</button>
    </div>
  )

  const rowTags = (
    <div className="card-actions flex-1 flex-nowrap items-center">
      <div className="badge badge-primary shrink-0">
        {item.details.type ?? item.details.slot}
      </div>
      <div className="badge badge-primary shrink-0">
        ilvl: {item.details.itemLevel}
      </div>
    </div>
  )

  return (
    <li key={item.id}>
      <div className="card card-side bg-base-200  my-1 rounded-md py-0">
        {icon}
        <div className="card-body gap-0 overflow-hidden p-1 ">
          {rowNameAndAction}
          {rowTags}
        </div>
      </div>
    </li>
  )
}
