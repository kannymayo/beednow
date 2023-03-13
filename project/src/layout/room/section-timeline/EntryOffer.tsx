import clsx from 'clsx'
import {
  CurrencyDollarIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import UserCircleIconSVG from '@/assets/icon-fallback-user.svg'

import { Offer } from '@/api/offer'
import { useUserAtoms } from '@/store/useUserAtom'

export default function ({
  username,
  userId,
  userAvatar,
  amount,
  isValid,
  isHighest,
}: Partial<Offer> & { isHighest?: boolean }) {
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

  // background for own offer
  const clsUsername = clsx({
    'text-white bg-gradient-to-r from-cyan-600 to-sky-600': isFromSelf,
  })

  // conditional for valid offer
  const clsIconBox = clsx(
    {
      'from-slate-600 to-amber-600 ': !isValid,
      'from-yellow-600 to-amber-600': isValid,
    },
    'cols-span-1 flex items-center justify-center bg-gradient-to-r '
  )

  const clsAmountSection = clsx(
    {
      'current-highest text-white': isHighest,
    },
    'col-span-5 flex items-center justify-end px-2 font-mono text-lg font-thin'
  )

  // conditional for valid offer
  const clsRoot = clsx(
    {
      'opacity-20 hover:opacity-100': !isValid,
    },
    'overflow-hidden grid h-8 grid-cols-2 bg-white drop-shadow last:mb-0 select-none box-content hover:bg-slate-200'
  )
  return (
    <li className={clsRoot}>
      {/* Amount */}
      <div className="col-span-1 grid grid-cols-6 items-stretch">
        <div className={clsIconBox}>
          {isValid ? (
            <CurrencyDollarIcon className={'h-6 w-6 text-white'} />
          ) : (
            <ExclamationTriangleIcon className={'h-6 w-6 text-white'} />
          )}
        </div>
        <span className={clsAmountSection}>{amount}</span>
      </div>

      {/* User */}
      <div className="col-span-1 grid h-full grid-cols-6 overflow-hidden">
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
        <span className="relative col-span-5 flex items-center justify-center px-2 text-xs">
          {isFromSelf ? (
            <>
              <div className="absolute right-0 h-full w-1.5 bg-amber-700"></div>
              Me
            </>
          ) : (
            username
          )}
        </span>
      </div>
    </li>
  )
}
