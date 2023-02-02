import React from 'react'
import clsx from 'clsx'
import {
  ArrowDownTrayIcon,
  DocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { useMatch, Link, useNavigation } from 'react-router-dom'

import { ReactComponent as Logo } from '../assets/logo.svg'
import { useAuthContext } from '../store/AuthContext'
import ImportModal from './header/BiddingImporter'
import BiddingsFinishedModal from './header/BiddingsFinished'

export default function Header() {
  const { user, googleSignIn, signOut } = useAuthContext()
  // use loader and react query for this
  const isInRoom = !!useMatch('/room/:id')?.params?.id

  const loginBtnCls = clsx(
    'mt-4 inline-flex items-center rounded border-0 bg-indigo-500 py-1 px-3 text-base hover:bg-indigo-600 focus:outline-none md:mt-0'
  )
  const loginBtnSvg = (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="ml-1 h-4 w-4"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14M12 5l7 7-7 7"></path>
    </svg>
  )
  const LoginButton = (
    <button onClick={() => googleSignIn()} className={loginBtnCls}>
      Login{loginBtnSvg}
    </button>
  )

  const avatarFirebase = (
    <UserIcon className="mask mask-circle h-8 w-8 bg-slate-50 text-slate-900" />
  )
  const avatarGoogle = (
    <div className="avatar mask mask-circle h-10 w-10 shrink-0">
      <img src={user.photoURL} />
    </div>
  )
  const normalizedAvatar =
    user?.providerData?.[0]?.providerId === 'password'
      ? avatarFirebase
      : avatarGoogle

  const nameFirebase = user.email
  const nameGoogle = user.displayName
  const normalizedName =
    user?.providerData?.[0]?.providerId === 'password'
      ? nameFirebase
      : nameGoogle

  const logoutBtnCls = clsx(
    'dropdown dropdown-hover dropdown-bottom dropdown-end flex w-44 self-stretch px-4 rounded items-center hover:bg-slate-300 hover:text-slate-900 active:bg-slate-400  text-white'
  )
  const LogoutButton = (
    <div className={logoutBtnCls}>
      <label
        tabIndex={0}
        className="flex cursor-pointer items-center gap-2 truncate"
      >
        <div className="truncate">{normalizedName}</div>
        {normalizedAvatar}
      </label>
      {/* Dropdown on hover */}
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 w-56 rounded-md p-2 shadow"
      >
        <li>
          <a
            onClick={signOut}
            className=" flex   justify-between p-2 text-slate-900 hover:bg-indigo-500 hover:text-gray-200"
          >
            Logout
            <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
          </a>
        </li>
      </ul>
    </div>
  )

  const LogoLink = (
    <Link
      to="/"
      className="title-font flex items-center font-medium text-gray-900"
    >
      <Logo />
      <span className="ml-3 text-xl">BeedNow</span>
    </Link>
  )

  const BtnForImportModal = (
    <label
      htmlFor="import-modal"
      className="btn btn-sm gap-1 rounded border-none bg-transparent hover:bg-indigo-500 active:bg-indigo-600"
    >
      Import
      <ArrowDownTrayIcon className="h-6 w-6" />
    </label>
  )

  const BtnForFinishedModal = (
    <label
      htmlFor="finished-modal"
      className="btn btn-sm gap-1 rounded border-none bg-transparent hover:bg-indigo-500 active:bg-indigo-600"
    >
      Finished
      <DocumentCheckIcon className="h-6 w-6" />
    </label>
  )

  return (
    <div className="col-span-13 col-start-auto">
      <ImportModal />
      <BiddingsFinishedModal />

      <header className="body-font h-full bg-slate-400 text-gray-200">
        <div className="container mx-auto flex h-full  items-center px-12 md:flex-row">
          {LogoLink}
          <nav className="flex flex-wrap items-center justify-center gap-1 px-4 text-base md:ml-auto">
            {isInRoom ? (
              <>
                {BtnForImportModal}
                {BtnForFinishedModal}
              </>
            ) : null}
            {user.uid ? LogoutButton : LoginButton}
          </nav>
        </div>
      </header>
    </div>
  )
}
