import clsx from 'clsx'
import { useState } from 'react'
import { useDebounce } from 'ahooks'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { useHighestOfferAtomValue } from '@/store/useOfferAtom'

export default function HeaderCurrentHighest() {
  const highestOffer = useHighestOfferAtomValue()

  return (
    <div className="stat @container grid-cols-4 grid-rows-4 gap-x-0 overflow-hidden p-2 pb-0">
      <div className="stat-figure text-secondary col-span-1 col-start-4 row-span-2 row-start-2">
        <CurrencyDollarIcon className="@[135px]:visible invisible h-10 w-10 text-yellow-500" />
      </div>
      <div className="stat-title cols-span-4 row-span-1 select-none">
        Currently at:
      </div>
      <div className="stat-value col-span-3 row-span-2 flex items-center">
        {highestOffer?.amount || '0'}
      </div>
      <div className="stat-desc col-span-4 row-span-1">
        {highestOffer?.userName || '-'}
      </div>
    </div>
  )
}
