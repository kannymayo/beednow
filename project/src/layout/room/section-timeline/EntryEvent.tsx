import clsx from 'clsx'
import {
  PauseCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

import { Offer } from '@/api/offer'

export default function ({ username, amount, event }: Partial<Offer>) {
  const clsTypeIcon = clsx('h-6 w-6 text-white')

  var icon
  if (event === 'pause') {
    icon = <PauseCircleIcon className={clsTypeIcon} />
  } else if (event === 'resume') {
    icon = <PlayCircleIcon className={clsTypeIcon} />
  } else {
    icon = <ClockIcon className={clsTypeIcon} />
  }

  var headerText
  if (event === 'pause') {
    headerText = 'Paused'
  } else if (event === 'resume') {
    headerText = 'Resumed'
  } else {
    headerText = 'Extended'
  }

  //  stage is silent (unless to host?)
  var bodyText
  if (event === 'pause') {
    bodyText = 'Paused'
  } else if (event === 'resume') {
    bodyText = 'Resumed'
  } else {
    bodyText = `+${amount}s`
  }

  const clsBodyText = clsx(
    {
      'text-green-800': event === 'extend',
    },
    'col-span-5 flex items-center justify-center px-2'
  )

  const clsRoot = clsx(
    'mb-1 grid h-8 grid-cols-2 border bg-white drop-shadow last:mb-0 hover:ring-1 hover:ring-inset hover:ring-slate-600 select-none'
  )
  return (
    <li className={clsRoot}>
      {/* Amount */}
      <div className="col-span-1 grid grid-cols-6  items-stretch">
        <div className="cols-span-1 flex items-center justify-center bg-gradient-to-r from-teal-600 to-cyan-600">
          {icon}
        </div>
        <span className="col-span-5 flex items-center justify-end px-2 text-xs text-slate-400">
          {headerText}
        </span>
      </div>

      {/* User */}
      <div className="col-span-1 grid grid-cols-6">
        <div className="col-span-1 my-1 flex items-center justify-center border-x text-zinc-500">
          <BellIcon className="h-6 w-6" />
        </div>
        <span className={clsBodyText}>{bodyText}</span>
      </div>
    </li>
  )
}
