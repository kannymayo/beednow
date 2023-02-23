import clsx from 'clsx'
import {
  CurrencyDollarIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

import { Offer } from '@/api/offer'

export default function ({
  username,
  userId,
  amount,
  isValid,
}: Partial<Offer>) {
  // badge for self
  const clsIconBox = clsx(
    {
      'from-slate-600 to-amber-600 ': !isValid,
      'from-yellow-600 to-amber-600': isValid,
    },
    'cols-span-1 flex items-center justify-center bg-gradient-to-r '
  )

  const clsRoot = clsx(
    {
      'opacity-20 hover:opacity-100 hover:bg-slate-200': !isValid,
    },
    'mb-1 overflow-hidden grid h-8 grid-cols-2 border bg-white drop-shadow last:mb-0 hover:ring-1 hover:ring-inset hover:ring-slate-600 select-none'
  )
  return (
    <li className={clsRoot}>
      {/* Amount */}
      <div className="col-span-1 grid grid-cols-6 items-stretch ">
        <div className={clsIconBox}>
          {isValid ? (
            <CurrencyDollarIcon className={'h-6 w-6 text-white'} />
          ) : (
            <ExclamationTriangleIcon className={'h-6 w-6 text-white'} />
          )}
        </div>
        <span className="col-span-5 flex items-center justify-end px-2 font-mono text-lg font-thin">
          {amount}
        </span>
      </div>

      {/* User */}
      <div className="col-span-1 grid grid-cols-6">
        <div className="col-span-1 flex items-center justify-center border-x bg-gradient-to-r from-stone-400 to-zinc-400 text-white">
          <UserCircleIcon className="h-6 w-6" />
        </div>
        <span className="col-span-5 flex items-center justify-center px-2 text-xs">
          {username}
        </span>
      </div>
    </li>
  )
}
