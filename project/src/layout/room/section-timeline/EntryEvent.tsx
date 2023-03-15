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
      clsTypeIcon = clsx(iconColor, clsTypeIcon)
      icon = <PauseCircleIcon className={clsTypeIcon} />
      break
    case 'resume':
      headerText = 'Resumed'
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
        'group grid h-8 select-none grid-cols-2 bg-white drop-shadow last:mb-0 hover:contrast-125'
      )}
    >
      {/* First half */}
      <div
        className={clsx(
          // grow when hovered
          'bg-slate-500 transition-all group-hover:-ml-2 group-hover:rounded-l-md group-hover:pl-2',
          'col-span-1 grid grid-cols-6 items-stretch'
        )}
      >
        {/* Icon */}
        <div className="col-span-1 my-1 flex items-center justify-center text-white">
          <BellIcon className="h-6 w-6" />
        </div>
        {/* Body */}
        <div className="col-span-5 flex items-center justify-end gap-1 bg-white px-2 text-xs text-slate-600 transition-all group-hover:text-slate-900">
          {headerText}
        </div>
      </div>

      {/* Second half */}
      <div className="col-span-1 grid grid-cols-6">
        {/* Icon */}
        <div
          className={clsx(
            {
              'rounded-tr-xl bg-gradient-to-t from-red-800 to-amber-800 text-white':
                event === 'pause',
              'rounded-br-xl bg-gradient-to-b from-lime-800 to-teal-800':
                event === 'resume',
            },
            'flex items-center justify-center border-x text-white transition-colors'
          )}
        >
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
