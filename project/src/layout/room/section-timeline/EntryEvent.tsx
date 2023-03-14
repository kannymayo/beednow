import clsx from 'clsx'
import {
  PauseCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  BellIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

import { Offer } from '@/api/offer'

export default function ({
  username,
  amount,
  event,
  numCollapsed = 0,
}: Partial<Offer> & {
  numCollapsed?: number
}) {
  let iconColor
  let clsTypeIcon = 'h-6 w-6'
  let icon
  let headerText = ''
  let bodyText = ''
  switch (event) {
    case 'pause':
      headerText = 'Paused'
      iconColor = 'text-cyan-600'
      clsTypeIcon = clsx(iconColor, clsTypeIcon)
      icon = <PauseCircleIcon className={clsTypeIcon} />
      break
    case 'resume':
      headerText = 'Resumed'
      iconColor = 'text-cyan-600'
      clsTypeIcon = clsx(iconColor, clsTypeIcon)
      icon = <PlayCircleIcon className={clsTypeIcon} />
      break
    case 'elapsed':
      headerText = "Time's up!"
      iconColor = 'text-purple-600'
      clsTypeIcon = clsx(iconColor, clsTypeIcon)
      icon = <CheckCircleIcon className={clsTypeIcon} />
      break
    case 'extend':
      headerText = 'Extended'
      bodyText = `+${amount}s`
      iconColor = 'text-green-600'
      clsTypeIcon = clsx(iconColor, clsTypeIcon)
      icon = <ClockIcon className={clsTypeIcon} />
      break
    case 'shorten':
      headerText = 'Shortened'
      bodyText = `-${amount}s`
      iconColor = 'text-red-600'
      clsTypeIcon = clsx(iconColor, clsTypeIcon)
      icon = <ClockIcon className={clsTypeIcon} />
      break
  }

  const clsBodyText = clsx(
    {
      'text-green-800': event === 'extend',
      'text-red-800': event === 'shorten',
    },
    'col-span-5 flex items-center justify-center px-2'
  )

  return (
    <li
      className={clsx(
        {
          // twin borders for pause/resume
          'border-0 border-t-2 border-cyan-600': event === 'pause',
          'border-0 border-b-2 border-sky-600': event === 'resume',
        },
        'border-1 box-content grid h-8 select-none grid-cols-2 bg-white drop-shadow last:mb-0 hover:bg-slate-200'
      )}
    >
      {/* Amount */}
      <div className="col-span-1 grid grid-cols-6  items-stretch">
        {/* Icon */}
        <div className="col-span-1 my-1 flex items-center justify-center border-r text-zinc-500">
          <BellIcon className="h-6 w-6" />
        </div>
        {/* Body */}
        <div className="col-span-5 flex items-center justify-end gap-1 px-2 text-xs text-slate-400">
          {headerText}
        </div>
      </div>

      {/* User */}
      <div className="col-span-1 grid grid-cols-6">
        {/* Icon */}
        <div className="'cols-span-1 bg-slate-500' my-1 flex items-center justify-center border-x">
          {icon}
        </div>
        {/* Body */}
        <div className={clsBodyText}>
          {numCollapsed > 0 ? (
            <div className="absolute right-3.5 flex h-full w-5 items-center">
              <div
                className="h-5 w-5 rounded-full bg-slate-400 text-center text-sm leading-5 text-white "
                title={`${numCollapsed + 1} similar offers collapsed`}
              >
                {numCollapsed + 1}
              </div>
            </div>
          ) : null}
          {bodyText}
        </div>
      </div>
    </li>
  )
}
