import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { usePopper } from 'react-popper'

import { ItemOccurrence, IOCGroupedAction } from './BiddingImporter'

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
  const stylesSelectedBackground = item.formState?.selected
    ? 'bg-slate-100'
    : 'bg-transparent'

  // popperjs is unstyled, styling arrow thru css is kinda crazy
  const [refElement, setRefElement] = useState<HTMLElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
  const { styles, attributes, update } = usePopper(refElement, popperElement, {
    placement: 'top-end',
  })
  const [shouldShowPopper, setShouldShowPopper] = useState(false)
  const stylesCopyBtn = isItemHovered ? 'block' : 'hidden'

  // introduce extra recalculations.
  // calculation is correct at init, but somehow messed up after awhile
  // due to animation or async stuff, not sure.
  useEffect(() => {
    if (update) update()
  }, [shouldShowPopper])

  //
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

  //
  const copyBtnCls = clsx(
    stylesCopyBtn,
    'btn btn-xs btn-outline border-2 text-slate-400 hover:border-slate-600 hover:bg-transparent hover:text-slate-900'
  )
  const copyBtnPopperCls = clsx(
    { invisible: !shouldShowPopper },
    'alert-success rounded-md p-1 shadow-lg'
  )
  const nameAndCopyBtn = (
    <div className="flex min-w-0 flex-grow justify-between">
      <div className="min-w-0 truncate">
        {item.qry?.isSuccess === true ? item?.details?.name : 'Loading'}
      </div>
      <button onClick={handleCopyToClipboard} className={copyBtnCls}>
        copy
      </button>
      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className={copyBtnPopperCls}
      >
        Copied
      </div>
    </div>
  )

  const labelContainerCls = clsx(
    stylesSelectedBackground,
    'flex cursor-pointer place-items-center rounded-sm border-opacity-100 only:rounded-tl-xl hover:bg-indigo-200'
  )
  const dataWowhead = `item=${item.details?.id}&domain=wrath`
  const _RETURN = (
    <label
      onMouseOver={toggleIsItemHovered}
      onMouseOut={toggleIsItemHovered}
      ref={setRefElement}
      className={labelContainerCls}
    >
      {itemChkBox}
      <div className="flex min-w-0 flex-grow select-none items-center pr-1">
        <a href="#" data-wowhead={dataWowhead}>
          <img className="h-8 w-8" src={item.details?.iconUrl}></img>
        </a>
        {nameAndCopyBtn}
      </div>
    </label>
  )

  return _RETURN

  function handleClickSingle() {
    dispatch({ type: 'toggle-single', payload: { id, seq } })
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(
      item.details?.name + ':' + item.details?.id ?? ''
    )
    setShouldShowPopper(true)
    setTimeout(() => {
      setShouldShowPopper(false)
    }, 500)
  }

  function toggleIsItemHovered() {
    setIsItemHovered((i) => !i)
  }
}
