import React from 'react'
import ImportModal from './header/ImportModal'

export default function Header() {
  const LoginButton = (
    <button className="mt-4 inline-flex items-center rounded border-0 bg-indigo-500 py-1 px-3 text-base hover:bg-indigo-600 focus:outline-none md:mt-0">
      Login
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
    </button>
  )

  const Logo = (
    <a className="title-font mb-4 flex items-center font-medium text-gray-900 md:mb-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-10 w-10 rounded-full bg-indigo-500 p-2 text-white"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span className="ml-3 text-xl">BeedNow</span>
    </a>
  )

  const NavItems = (
    <nav className="flex flex-wrap items-center justify-center gap-1 px-4 text-base md:ml-auto">
      {/* New modal */}
      <label htmlFor="import-modal" className="btn btn-sm rounded-3xl">
        +
      </label>
      <label htmlFor="my-drawer" className="btn  drawer-button btn-sm">
        Show Finished Bids
      </label>
    </nav>
  )

  return (
    <>
      <ImportModal />

      <header className="body-font h-full bg-slate-400 text-gray-200">
        <div className="container mx-auto flex h-full flex-col flex-wrap items-center px-12 md:flex-row">
          {Logo}
          {NavItems}
          {LoginButton}
        </div>
      </header>
    </>
  )
}
