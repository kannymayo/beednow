import React from 'react'

import { ItemOccurrence } from './ImportModal'

export default function ImportableItemGroup({
  group,
}: {
  group: ItemOccurrence[]
}) {
  const single = <ImportableItem item={group[0]} />
  const multiple = (
    <>
      <div>{group.length}</div>
      <ul>
        {group.map((itemOccurrence) => (
          <li key={itemOccurrence._idSeq}>
            <ImportableItem item={itemOccurrence} />
          </li>
        ))}
      </ul>
    </>
  )

  return group.length === 1 ? single : multiple
}

function ImportableItem({ item }: { item: ItemOccurrence }) {
  return (
    <>
      <label className="input-group flex place-items-center bg-gray-300 ">
        <input
          className="checkbox-primary checkbox-lg"
          type="checkbox"
          id="id"
        />
        <div className=" truncate">
          {item.qry?.isSuccess === true
            ? `${item?.details?.name}: ${item?.details?.id}`
            : 'Loading'}
        </div>
      </label>
    </>
  )
}
