import React, { useState } from 'react'
import clsx from 'clsx'
import { toasto } from '@/utils/toasto'

import { ItemOccurrence, IOCGroupedAction } from './Container'

export default function ImportableItem({
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
  const [isItemHovered, setIsItemHovered] = useState(false)
  const stylesCopyBtn = isItemHovered ? 'block' : 'hidden'

  const itemChkBoxCls = clsx(
    { 'rounded-tl-xl': !isInGroup, 'rounded-tl-sm': isInGroup },
    'checkbox checkbox-primary checkbox-lg unchecked:ring-inset rounded-none border-2 border-slate-100  checked:ring-0 hover:border-slate-100 focus:border-slate-100 focus:ring-0 focus:ring-offset-0'
  )
  const itemChkBox = (
    <input
      checked={item.formState?.selected}
      onChange={handleClickSingle}
      className={itemChkBoxCls}
      type="checkbox"
    />
  )

  const copyBtnCls = clsx(
    stylesCopyBtn,
    'btn btn-xs btn-outline border-2 text-slate-400 hover:border-slate-600 hover:bg-transparent hover:text-slate-900'
  )
  const nameAndCopyBtn = (
    <div className="flex min-w-0 flex-grow justify-between">
      <div className="min-w-0 truncate">
        {item.qry?.isSuccess === true ? item?.details?.name : 'Loading'}
      </div>
      <button onClick={handleCopyToClipboard} className={copyBtnCls}>
        copy
      </button>
    </div>
  )

  const labelContainerCls = clsx(
    {
      'bg-slate-100': item.formState?.selected,
      'bg-transparent': !item.formState?.selected,
    },
    'flex cursor-pointer place-items-center rounded-sm border-opacity-100 only:rounded-tl-xl hover:bg-indigo-200'
  )
  const dataWowhead = `item=${item.details?.id}&domain=wrath`
  const wowheadLink = (
    <a href="#" data-wowhead={dataWowhead}>
      <img className="h-8 w-8" src={item.details?.iconUrl}></img>
    </a>
  )
  const wowheadLinkRoundedSmall = (
    <a href="#" data-wowhead={dataWowhead}>
      <img className="h-6 w-6 rounded-lg" src={item.details?.iconUrl}></img>
    </a>
  )
  const _RETURN = (
    <label
      onMouseOver={toggleIsItemHovered}
      onMouseOut={toggleIsItemHovered}
      className={labelContainerCls}
    >
      {itemChkBox}
      <div className="flex min-w-0 flex-grow select-none items-center pr-1">
        {wowheadLink}
        {nameAndCopyBtn}
      </div>
    </label>
  )

  return _RETURN

  function handleClickSingle() {
    dispatch({ type: 'toggle-single', payload: { id, seq } })
  }

  function handleCopyToClipboard() {
    const content = item.details?.name + ':' + item.details?.id ?? ''
    const toastMsg = (
      <div className="grid gap-2">
        <div className="flex items-center gap-1">
          {wowheadLinkRoundedSmall}Copied to Clipboard
        </div>
        <div className="flex min-w-0 rounded-sm bg-indigo-50 px-1 text-sm text-slate-600 ">
          <div className="truncate">{`${content}`}</div>
        </div>
      </div>
    )
    navigator.clipboard.writeText(content)
    toasto(toastMsg, { type: 'info' })
  }

  function toggleIsItemHovered() {
    setIsItemHovered((i) => !i)
  }
}
