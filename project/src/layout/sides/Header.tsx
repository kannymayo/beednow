import clsx from 'clsx'
import {
  ArrowDownTrayIcon,
  DocumentCheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { useMatch, Link, useNavigate, Outlet } from 'react-router-dom'

import { ReactComponent as Logo } from '@/assets/logo.svg'
import { useSignOut } from '@/hooks/useToastyAuth'
import useUserAtom from '@/store/useUserAtom'
import ImportModal from './header/BiddingImporter'
import BiddingsFinishedModal from './header/BiddingsFinished'

export default function Header() {
  const [user] = useUserAtom()
  const [signout] = useSignOut()
  const navigate = useNavigate()
  // use loader and react query for this
  const isInRoom = !!useMatch('/room/:id')?.params?.id
  const isLogin = !!user.uid

  const avatar = (
    <div className="avatar mask mask-circle h-10 w-10 shrink-0">
      <img src={user.photoURL} />
    </div>
  )

  const menuPanel = (
    <label
      tabIndex={0}
      className="flex cursor-pointer items-center gap-2 truncate"
    >
      <div className="truncate">{user.displayName}</div>
      {avatar}
    </label>
  )

  const menuItemSignout = (
    <li>
      <a
        onClick={handleSignout}
        className=" flex   justify-between p-2 text-slate-900 hover:bg-indigo-500 hover:text-gray-200"
      >
        Logout
        <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
      </a>
    </li>
  )

  const menuDropdown = (
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 w-56 rounded-md p-2 shadow"
    >
      {menuItemSignout}
    </ul>
  )

  const logoutBtnCls = clsx(
    'dropdown dropdown-hover dropdown-bottom dropdown-end flex w-44 self-stretch px-4 rounded items-center hover:bg-slate-300 hover:text-slate-900 active:bg-slate-400  text-white'
  )
  const logoutBtn = (
    <div className={logoutBtnCls}>
      {menuPanel}
      {menuDropdown}
    </div>
  )

  const logoLink = (
    <Link
      to="/"
      className="title-font flex items-center font-medium text-gray-900"
    >
      <Logo />
      <span className="ml-3 text-xl">BeedNow</span>
    </Link>
  )

  const btnForImportModal = (
    <label
      htmlFor="import-modal"
      className="btn btn-sm gap-1 rounded border-none bg-transparent hover:bg-indigo-500 active:bg-indigo-600"
    >
      Import
      <ArrowDownTrayIcon className="h-6 w-6" />
    </label>
  )

  const btnForFinishedModal = (
    <label
      htmlFor="finished-modal"
      className="btn btn-sm gap-1 rounded border-none bg-transparent hover:bg-indigo-500 active:bg-indigo-600"
    >
      Finished
      <DocumentCheckIcon className="h-6 w-6" />
    </label>
  )

  const logInOrOutBtn = isLogin ? logoutBtn : null
  const navItems = (
    <nav className="flex h-full flex-wrap items-center justify-center gap-1 px-4 text-base md:ml-auto">
      {isInRoom ? (
        <>
          {btnForImportModal}
          {btnForFinishedModal}
        </>
      ) : null}
      {logInOrOutBtn}
    </nav>
  )

  const _RETURN = (
    <>
      <div className="col-span-13 col-start-auto">
        <ImportModal />
        <BiddingsFinishedModal />

        <header className="body-font h-full bg-slate-400 text-gray-200">
          <div className="container mx-auto flex h-full  max-w-2xl items-center md:flex-row lg:max-w-3xl xl:max-w-5xl">
            {logoLink}
            {navItems}
          </div>
        </header>
      </div>
      <Outlet />
    </>
  )

  return _RETURN

  async function handleSignout() {
    await signout()
    navigate('/')
  }
}
