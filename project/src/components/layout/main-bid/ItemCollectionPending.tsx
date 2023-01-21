import React, { useMemo, useEffect, useState } from 'react'
import parseTooltip, { ItemFromAPI } from '../../../utils/parse-wow-tooltip'
import readExport from '../../../utils/read-export'

export default function ItemCollectionPending() {
  const [items, setItems] = useState<ItemFromAPI[]>([])
  const itemIds = useMemo(() => [40273, 40247, 40254, 44577], [])

  // fetch the result from url
  useEffect(() => {
    itemIds.forEach((id) => {
      const url = `https://nether.wowhead.com/tooltip/item/${id}?dataEnv=8&locale=0`
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const parsed = parseTooltip(data, id)
          setItems((prevState) => [...prevState, parsed])
        })
    })
  }, [itemIds])

  // const url = `https://nether.wowhead.com/tooltip/item/40627?dataEnv=8&locale=0`

  return (
    <>
      collection pending
      <ul>
        {items &&
          items.map((item) => (
            <li key={item.name}>
              <div className="card card-side bg-base-200  my-1 rounded-md py-0">
                <figure className="flex-shrink-0">
                  <a href="#" data-wowhead={`item=${item.id}&domain=wrath`}>
                    <img src={item.iconUrl} />
                  </a>
                </figure>
                <div className="card-body gap-0 overflow-hidden p-1 ">
                  <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                    {item.name}
                  </div>
                  <div className="card-actions flex-1 items-center justify-between">
                    <div className="badge badge-primary">
                      {item.type ?? item.slot}
                    </div>
                    <button className="btn btn-xs font-light">Preview</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  )
}
