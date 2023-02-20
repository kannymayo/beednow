import { useEffect } from 'react'
import {
  ArrowDownTrayIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline'
import { Link, Outlet } from 'react-router-dom'

import { useParams } from 'react-router-dom'
import { ReactComponent as Logo } from '@/assets/logo.svg'
import { useUserAtomMaster } from '@/store/useUserAtom'
import { useQueryCurrentRoom } from '@/api/room'
import { useIsRoomHostAtom, useRoomIdSetAtom } from '@/store/useRoomAtom'
import ImportModal from './header/BiddingImporter'
import BiddingsFinishedModal from './header/BiddingsFinished'
import CurrentUser from './user/CurrentUser'

export default function WithHeader() {
  // update title for better bookmarking
  const [queryCurrentRoom] = useQueryCurrentRoom()
  const roomInfo = queryCurrentRoom.data
  useUpdateTitle(roomInfo?.name || '')

  // sync isRoomHost to Atom
  const [user] = useUserAtomMaster()
  const [isRoomHost, setIsRoomHost] = useIsRoomHostAtom({
    resetOnUnmount: true,
  })
  useEffect(() => {
    setIsRoomHost(user.uid === roomInfo?.hostedBy)
  }, [roomInfo?.hostedBy])

  // sync roomIdd in url to Atom
  const param = useParams()
  const setRoomId = useRoomIdSetAtom({ resetOnUnmount: true })
  useEffect(() => {
    setRoomId(param.roomId || '')
    return () => {
      setRoomId('')
    }
  }, [param])

  const logoLink = (
    <Link
      to="/"
      className="title-font flex items-center font-medium text-gray-900"
    >
      <Logo />
      <span className="ml-3 text-xl">{roomInfo?.name || 'BeedNow'}</span>
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

  const navItems = (
    <nav className="flex h-full flex-wrap items-center justify-center gap-1 px-4 text-base md:ml-auto">
      {isRoomHost ? (
        <>
          {btnForImportModal}
          {btnForFinishedModal}
        </>
      ) : null}
      <CurrentUser />
    </nav>
  )

  const header = (
    <>
      {isRoomHost ? (
        <>
          <ImportModal />
          <BiddingsFinishedModal />
        </>
      ) : null}

      <header className="body-font h-full bg-slate-400 text-gray-200">
        <div className="container mx-auto flex h-full  max-w-2xl items-center md:flex-row lg:max-w-3xl xl:max-w-5xl">
          {logoLink}
          {navItems}
        </div>
      </header>
    </>
  )

  const _RETURN = (
    <div className="grid-rows-2-header-body grid h-full min-h-[500px] w-full min-w-[768px]">
      {header}
      <Outlet />
    </div>
  )

  return _RETURN

  function useUpdateTitle(title: string) {
    useEffect(() => {
      if (title) document.title = `BeedNow: ${title}` || 'BeedNow'
    }, [title])
  }
}
