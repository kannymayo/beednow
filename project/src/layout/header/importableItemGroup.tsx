import React from 'react'
import clsx from 'clsx'

import { ItemOccurrence, IOCGroupedAction } from './BiddingImporter'
import ImportableItem from './ImportableItem'
import TristateCheckBox from '../../components/TristateCheckBox'

export default function ImportableItemGroup({
  group,
  id,
  dispatch: dispatch,
}: {
  id: number
  group: ItemOccurrence[]
  dispatch: React.Dispatch<IOCGroupedAction>
}) {
  const isSingle = group.length === 1
  if (isSingle) {
    return (
      <ul>
        <li>
          <ImportableItem
            item={group[0]}
            id={id}
            seq={JSON.parse(group[0]._idSeq)[1]}
            dispatch={dispatch}
            isInGroup={false}
          />
        </li>
      </ul>
    )
  }

  // just to trigger intelisense
  const containerCls = clsx(
    'rounded-sm rounded-tl-xl border-2 border-slate-100 focus-within:ring-2'
  )
  const headerCls = clsx(
    'flex flex-1 cursor-pointer select-none place-items-center justify-center truncate text-sm opacity-0 hover:opacity-100'
  )
  const triStateCls = clsx(
    'checkbox checkbox-primary checkbox-lg rounded-none rounded-tl-xl border-2 border-slate-100 checked:ring-0 indeterminate:opacity-60 hover:border-slate-100 focus:ring-0 focus:ring-offset-0'
  )
  return (
    <div className={containerCls}>
      <label className="mt-[-2px] ml-[-2px] flex ">
        <TristateCheckBox
          status={calculateTriState(group)}
          onChange={handleClickGroup}
          className={triStateCls}
        />
        <div className={headerCls}>Toggle all {group.length} items</div>
      </label>
      <ul className="ml-[-2px] mb-[-2px] mr-[-2px] pl-8">
        {group.map((itemOccurrence) => (
          <li key={itemOccurrence._idSeq} className="">
            <ImportableItem
              item={itemOccurrence}
              id={id}
              seq={JSON.parse(itemOccurrence._idSeq)[1]}
              dispatch={dispatch}
              isInGroup={true}
            />
          </li>
        ))}
      </ul>
    </div>
  )
  function handleClickGroup() {
    dispatch({ type: 'toggle-group', payload: { id } })
  }
}

function calculateTriState(group: ItemOccurrence[]) {
  const totalCount = group.length
  const selectedCount = group.filter((item) => item.formState?.selected).length

  if (totalCount === selectedCount) {
    return 'checked'
  } else if (selectedCount === 0) {
    return 'unchecked'
  } else {
    return 'indeterminate'
  }
}
