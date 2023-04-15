import clsx from 'clsx'
import {
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

import { Offer } from '@/api/offer'
import { useUserAtoms } from '@/store/useUserAtom'

export default function ({
  username,
  userId,
  userAvatar,
  amount,
  isValid,
  isHighest,
  numCollapsed = 0,
}: Partial<Offer> & { isHighest?: boolean; numCollapsed?: number }) {
  const [userSelf, isLoggedin] = useUserAtoms().get()
  const isFromSelf = userSelf.uid === userId

  // map userId to random hex color
  var userColor = '#000000'
  if (userId) {
    userColor =
      '#' + parseInt(userId, 36).toString(16).padStart(6, '0').slice(0, 6)
  }
  const randomColorForUser = {
    backgroundColor: userColor,
  } as React.CSSProperties

  // conditional for valid offer
  const clsIconBox = clsx(
    {
      'from-yellow-600 to-slate-600': !isValid,
      'from-yellow-600 to-amber-600': isValid,
    },
    'cols-span-1 flex items-center justify-center bg-gradient-to-r'
  )

  return (
    <li
      className={clsx(
        {
          'opacity-20 hover:opacity-100': !isValid,
        },
        'group box-content grid h-8 select-none grid-cols-2 bg-white drop-shadow transition-all last:mb-0 hover:contrast-125'
      )}
    >
      {/* Amount */}
      <div className="col-span-1 grid grid-cols-6 items-stretch bg-yellow-600 transition-all group-hover:-ml-2 group-hover:rounded-l-md group-hover:pl-2">
        {/* Icon */}
        <div className={clsIconBox}>
          {isValid ? (
            <CurrencyDollarIcon className={'h-6 w-6 text-white'} />
          ) : (
            <ExclamationTriangleIcon className={'h-6 w-6 text-white'} />
          )}
        </div>
        {/* Body */}
        <div
          className={clsx(
            {
              'current-highest text-white': isHighest,
            },
            'col-span-5 flex items-center justify-end gap-1 bg-white px-2 font-mono text-lg font-thin'
          )}
        >
          {amount}
        </div>
      </div>

      {/* User */}
      <div className="col-span-1 grid h-full grid-cols-6 overflow-hidden">
        {/* Icon */}
        <div
          style={{
            ...randomColorForUser,
          }}
          title={username}
          className="relative overflow-hidden"
        >
          {/* backdrop, colored based on uid */}
          <div className="absolute inset-0 backdrop-brightness-75"></div>
          <img
            src={userAvatar}
            referrerPolicy="no-referrer"
            className="mask mask-circle absolute z-10 h-full w-full object-contain object-center"
          />
        </div>
        {/* Body */}
        <div className="relative col-span-5 flex items-center justify-center px-2 text-xs">
          {isFromSelf ? (
            // Offer placed by self has special wording and stripe indicator
            <>
              <div className="absolute right-0 h-full w-1.5 bg-amber-700"></div>
              Me
            </>
          ) : (
            username
          )}
          {numCollapsed > 0 ? (
            // Non-zero collapsed offers shown as pill
            <div className="absolute right-3.5 flex h-full w-5 items-center">
              <div
                className="h-5 w-5 rounded-full bg-slate-400 text-center text-sm leading-5 text-white "
                title={`${numCollapsed + 1} similar offers collapsed`}
              >
                {numCollapsed + 1}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  )
}
