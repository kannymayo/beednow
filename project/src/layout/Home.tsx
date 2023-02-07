import React from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

import Protected from '../components/Protected'
import EnterRoom from './landing/EnterRoom'
import Header from './sides/Header'
import Room from './room/Room'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Header />}>
      <Route path="/" element={<EnterRoom />} />
      <Route element={<Protected />}>
        <Route path="/room">
          <Route path=":roomId" element={<Room />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

export default function Home() {
  return (
    <div className="grid-rows-12 grid-cols-13 grid h-full min-h-[500px] w-full min-w-[768px]">
      <RouterProvider router={router} />
    </div>
  )
}

function HeroPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="hero bg-base-200 col-span-13 row-span-12">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold uppercase">{children}</h1>
        </div>
      </div>
    </div>
  )
}

// topgrid, aka a specific room

function NotFound() {
  return <HeroPlaceholder>Not Found</HeroPlaceholder>
}
