import { ReactComponent as Logo } from '@/assets/logo.svg'
import { Link } from 'react-router-dom'

import { useAtomIsRoomHost } from '@/store/useRoomAtom'
import ModalImporter from './modal-importer/Container'
import ModalSummary from './modal-summary/ModalSummary'
import CurrentUser from './user/CurrentUser'

export default function Header() {
  const isRoomHost = useAtomIsRoomHost().getter()
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
              <ModalImporter />
              <ModalSummary />
            </>
          ) : null}
          <CurrentUser />
        </nav>
      </div>
    </header>
  )
}
