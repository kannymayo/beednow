import clsx from 'clsx'
import {
  PauseCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  BellIcon,
  CheckCircleIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline'

import { Offer } from '@/api/offer'

export default function ({ username, amount, event }: Partial<Offer>) {
  const clsTypeIcon = 'h-6 w-6 text-white'

  var icon
  if (event === 'pause') {
    icon = <PauseCircleIcon className={clsTypeIcon} />
  } else if (event === 'resume') {
    icon = <PlayCircleIcon className={clsTypeIcon} />
  } else if (event === 'extend') {
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
  }

  //  stage is silent (unless to host?)
  var bodyText
  if (event === 'pause') {
    bodyText = ''
  } else if (event === 'resume') {
    bodyText = ''
  } else if (event === 'extend') {
    bodyText = `+${amount}s`
  } else if (event === 'elapsed') {
  }

  const clsTypeIconBox = clsx(
    {
      'from-purple-600 to-violet-600': event === 'elapsed',
      'from-green-600 to-teal-600': event === 'extend',
      'from-cyan-600 to-blue-600': event === 'pause' || event === 'resume',
    },
    'cols-span-1 flex items-center justify-center bg-gradient-to-r bg-slate-500'
  )

  const clsBodyText = clsx(
    {
      'text-green-800': event === 'extend',
    },
    'col-span-5 flex items-center justify-center px-2'
  )

  const clsRoot = clsx(
    {
      'border-t-2 border-cyan-600 border-0': event === 'pause',
      'border-b-2 border-sky-600 border-0': event === 'resume',
    },
    'mb-1 grid h-8 grid-cols-2 border-1 bg-white drop-shadow last:mb-0 hover:ring-1 hover:ring-inset hover:ring-slate-600 select-none box-content'
  )
  return (
    <li className={clsRoot}>
      {/* Amount */}
      <div className="col-span-1 grid grid-cols-6  items-stretch">
        <div className={clsTypeIconBox}>{icon}</div>
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
