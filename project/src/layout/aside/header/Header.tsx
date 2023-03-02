import { ReactComponent as Logo } from '@/assets/logo.svg'
import {
  ArrowDownTrayIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

import { useFinishedBiddingsAtoms } from '@/store/useBiddingAtom'
import { useIsRoomHostAtoms } from '@/store/useRoomAtom'
import ImportModal from './modal-importer/BiddingImporter'
import BiddingsFinishedModal from './modal-summary/BiddingsFinished'
import CurrentUser from './user/CurrentUser'

export default function WithHeader() {
  const finishedBiddings = useFinishedBiddingsAtoms().get()
  const isRoomHost = useIsRoomHostAtoms().get()

  const totalFinishedBiddings = finishedBiddings.length
  const totalFinishedAmount = finishedBiddings.reduce(
    (acc, cur) => acc + (cur.closingAmount || 0),
    0
  )

  return (
    <header className="body-font h-full bg-slate-400 text-gray-200">
      <div className="container mx-auto flex h-full  max-w-2xl items-center md:flex-row lg:max-w-3xl xl:max-w-5xl">
        <Link
          to="/"
          className="title-font flex items-center font-medium text-gray-900"
        >
          <Logo />
          <span className="ml-3 text-xl">{'BeedNow'}</span>
        </Link>
        <nav className="flex h-full flex-wrap items-center justify-center gap-1 px-4 text-base md:ml-auto">
          {isRoomHost ? (
            <>
              <ImportModal />
              <BiddingsFinishedModal />
              <label
                htmlFor="import-modal"
                className="btn btn-sm gap-2 rounded border-none bg-transparent capitalize hover:bg-indigo-500 active:bg-indigo-600"
              >
                Import
                <ArrowDownTrayIcon className="h-6 w-6" />
              </label>
              <label
                htmlFor="finished-modal"
                className="btn btn-sm gap-1 rounded border-none bg-transparent capitalize hover:bg-indigo-500 active:bg-indigo-600"
              >
                {totalFinishedAmount > 0 ? (
                  `Total: ${totalFinishedAmount}(${totalFinishedBiddings})`
                ) : (
                  <></>
                )}
                <DocumentCheckIcon className="h-6 w-6" />
              </label>
            </>
          ) : null}
          <CurrentUser />
        </nav>
      </div>
    </header>
  )
}
