import clsx from 'clsx'
import {
  PauseCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  BellIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

import { Offer } from '@/api/offer'

export default function ({ username, amount, event }: Partial<Offer>) {
  const clsTypeIcon = clsx(
    {
      'text-purple-600': event === 'elapsed',
      'text-green-600': event === 'extend',
      'text-red-600': event === 'shorten',
      'text-cyan-600': event === 'pause' || event === 'resume',
    },
    'h-6 w-6'
  )

  var icon
  if (event === 'pause') {
    icon = <PauseCircleIcon className={clsTypeIcon} />
  } else if (event === 'resume') {
    icon = <PlayCircleIcon className={clsTypeIcon} />
  } else if (event === 'extend' || event === 'shorten') {
    icon = <ClockIcon className={clsTypeIcon} />
  } else if (event === 'elapsed') {
    icon = <CheckCircleIcon className={clsTypeIcon} />
  }

  var headerText
  if (event === 'pause') {
    headerText = 'Paused'
  } else if (event === 'resume') {
    headerText = 'Resumed'
  } else if (event === 'extend') {
    headerText = 'Extended'
  } else if (event === 'elapsed') {
    headerText = "Time's up!"
  } else if (event === 'shorten') {
    headerText = 'Shortened'
  }

  //  stage is silent (unless to host?)
  var bodyText
  if (event === 'pause') {
    bodyText = ''
  } else if (event === 'resume') {
    bodyText = ''
  } else if (event === 'extend') {
    bodyText = `+${amount}s`
  } else if (event === 'shorten') {
    bodyText = `-${amount}s`
  }

  const clsBodyText = clsx(
    {
      'text-green-800': event === 'extend',
      'text-red-800': event === 'shorten',
    },
    'col-span-5 flex items-center justify-center px-2'
  )

  // twin borders for pause/resume
  const clsRoot = clsx(
    {
      'border-t-2 border-cyan-600 border-0': event === 'pause',
      'border-b-2 border-sky-600 border-0': event === 'resume',
    },
    'grid h-8 grid-cols-2 border-1 bg-white drop-shadow last:mb-0 select-none box-content hover:bg-slate-200'
  )
  return (
    <li className={clsRoot}>
      {/* Amount */}
      <div className="col-span-1 grid grid-cols-6  items-stretch">
        <div className="col-span-1 my-1 flex items-center justify-center border-r text-zinc-500">
          <BellIcon className="h-6 w-6" />
        </div>
        <span className="col-span-5 flex items-center justify-end px-2 text-xs text-slate-400">
          {headerText}
        </span>
      </div>

      {/* User */}
      <div className="col-span-1 grid grid-cols-6">
        <div className="'cols-span-1 bg-slate-500' my-1 flex items-center justify-center border-x">
          {icon}
        </div>
        <span className={clsBodyText}>{bodyText}</span>
      </div>
    </li>
  )
}
