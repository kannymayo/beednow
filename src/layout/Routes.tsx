import React from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

import Protected from '@/components/Protected'
import Home from './Home'
import WithHeader from './aside/WithHeader'
import Room from './room/Room'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<WithHeader />}>
      <Route path="/" element={<Home />} />
      <Route element={<Protected />}>
        <Route path="/room">
          <Route path=":roomId" element={<Room />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

export default function Routes() {
  return <RouterProvider router={router} />
}

function HeroPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold uppercase">{children}</h1>
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return <HeroPlaceholder>Not Found</HeroPlaceholder>
}
