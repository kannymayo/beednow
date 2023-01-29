import React from 'react'
import classNames from 'classnames'

import { ItemOccurrence, IOCGroupedAction } from './ImportModal'

export default function ImportableItemGroup({
  group,
  id,
  dispatch: dispatch,
}: {
  id: number
  group: ItemOccurrence[]
  dispatch: React.Dispatch<IOCGroupedAction>
}) {
  const single = (
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

  const multiple = (
    <div className="rounded-sm rounded-tl-xl border-2 border-slate-100 focus-within:ring-2">
      <label className="mt-[-2px] ml-[-2px] flex ">
        <input
          className="checkbox checkbox-primary checkbox-lg rounded-none rounded-tl-xl border-2 border-slate-100 checked:ring-0 hover:border-slate-100 focus:ring-0 focus:ring-offset-0"
          type="checkbox"
          onChange={handleClickGroup}
        />
        <div className="flex flex-1 cursor-pointer select-none place-items-center justify-center truncate text-sm opacity-0 hover:opacity-100">
          Toggle all {group.length} items
        </div>
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

  return group.length === 1 ? single : multiple

  function handleClickGroup() {
    dispatch({ type: 'toggle-group', payload: { id } })
  }
}

function ImportableItem({
  item,
  id,
  seq,
  dispatch,
  isInGroup,
}: {
  item: ItemOccurrence
  id: number
  seq: number
  dispatch: React.Dispatch<IOCGroupedAction>
  isInGroup: boolean
}) {
  return (
    <label className="border-opacity-1000 flex place-items-center rounded-sm bg-indigo-50 only:rounded-tl-xl">
      <input
        className={classNames(
          { 'rounded-tl-xl': !isInGroup, 'rounded-tl-sm': isInGroup },
          'checkbox checkbox-primary checkbox-lg unchecked:ring-inset rounded-none border-2 border-slate-100  checked:ring-0 hover:border-slate-100 focus:border-slate-100 focus:ring-0 focus:ring-offset-0'
        )}
        type="checkbox"
        checked={item.formState?.selected}
        onChange={handleClickSingle}
      />
      <div className=" flex min-w-0 flex-grow select-none items-center justify-between pr-1">
        <img className="h-8 w-8" src={item.details?.iconUrl}></img>
        <div className="min-w-0 truncate">
          {item.qry?.isSuccess === true ? item?.details?.name : 'Loading'}
        </div>
        <button
          className="btn btn-xs btn-outline border-2 opacity-0 hover:border-slate-600 hover:bg-slate-100 hover:text-slate-700 hover:opacity-100"
          onClick={handleCopyToClipboard}
        >
          copy
        </button>
      </div>
    </label>
  )

  function handleClickSingle() {
    dispatch({ type: 'toggle-single', payload: { id, seq } })
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(
      item.details?.name + ':' + item.details?.id ?? ''
    )
  }
}
