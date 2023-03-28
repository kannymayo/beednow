import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

import { getRandomAvatar } from '@/utils/get-random-avatar'
import { useQueryUserProfile, useMutationUpdateAvatar } from '@/api/user'
import { useUserAtoms } from '@/atoms/user'
import { useSignOut } from '@/hooks/useToastyAuth'
import { useAtomRoomIdPreview } from '@/atoms/room'

export default function CurrentUser() {
  const [user, isLoggedIn] = useUserAtoms().get()
  const [signout] = useSignOut()
  const setRoomIdPreview = useAtomRoomIdPreview().setter()
  const navigate = useNavigate()
  const [{ data: userProfile }] = useQueryUserProfile({
    userId: user?.uid || '',
    isEnabled: isLoggedIn,
    isSubscribed: true,
  })
  const [mutation] = useMutationUpdateAvatar()

  if (!isLoggedIn) return <></>

  const { uid, provider } = user

  const logoutBtnCls = clsx(
    'dropdown dropdown-hover dropdown-bottom dropdown-end flex w-44 self-stretch px-4 rounded items-center hover:bg-slate-300 hover:text-slate-900  text-white'
  )
  return (
    <div className={logoutBtnCls}>
      {/* Menu Panel */}
      <label
        tabIndex={0}
        className="flex cursor-pointer items-center gap-2 truncate"
      >
        <div className="truncate">{user.displayName}</div>
        {/* Avatar */}
        <div className="avatar mask mask-circle h-10 w-10 shrink-0">
          <img
            referrerPolicy="no-referrer"
            src={userProfile && userProfile.avatarURL}
          />
        </div>
      </label>

      {/* Menu Dropdown */}
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 w-64 gap-1 rounded-md p-1 shadow"
      >
        {/* User ID field */}
        <li className="menu-title select-none">
          <span className="menu-title select-none">User ID</span>
        </li>
        <div className="mt-[-6px] max-w-full">
          <div className="mx-4 break-words leading-5">{uid} </div>
        </div>

        {/* Registered by field */}
        <li className="menu-title select-none">
          <span>Registered by</span>
        </li>
        <div className="mt-[-6px] max-w-full">
          <div className="mx-4 break-words leading-5">{provider}</div>
        </div>

        {/* For dev */}
        <li className="menu-title select-none">
          <span>Randomize avatar</span>
        </li>
        <div className="mt-[-6px] flex justify-center leading-5">
          <button
            onClick={handleRandomizeAvatar}
            className="btn btn-xs min-w-0 font-light capitalize"
          >
            Randomize Avatar
          </button>
        </div>

        <div className="divider m-0 h-0"></div>

        {/* Menu Item Signout */}
        <li className="mt-1">
          <span
            onClick={handleSignout}
            className=" pointer-events-auto flex justify-between text-slate-900 hover:bg-indigo-500 hover:text-gray-200"
          >
            Logout
            <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
          </span>
        </li>
      </ul>
    </div>
  )

  async function handleSignout() {
    await signout()
    setRoomIdPreview('')
    navigate('/')
  }

  function handleRandomizeAvatar() {
    if (!uid) return
    mutation.mutate({
      userId: uid,
      avatarURL: getRandomAvatar(),
    })
  }
}
