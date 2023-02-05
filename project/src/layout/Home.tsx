import React from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

import Protected from '../components/Protected'
import PublicOnly from '../components/PublicOnly'
import EnterRoom from './EnterRoom'
import Header from './Header'
import BiddingsPending from './main/BiddingsPending'
import BiddingsWatchlist from './main/BiddingsWatchlist'
import BidAction from './main/BidAction'
import BidChat from './main/BidChat'
import BidHistory from './main/BidHistory'
import BidItem from './main/BidItem'
import RegistrationPge from './Register'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Header />}>
      <Route path="/" element={<EnterRoom />} />
      <Route element={<PublicOnly />}>
        <Route path="/register" element={<RegistrationPge />} />
      </Route>
      <Route element={<Protected />}>
        <Route path="/room">
          <Route path=":roomId" element={<Room />} />
        </Route>
        <Route path="/user">
          <Route path=":userId/rooms" element={<TaggedRooms />} />
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
function Room() {
  return (
    <>
      <div className=" col-span-1 col-start-1 row-[2_/_span_11] ">
        <BiddingsPending />
      </div>
      <div className="col-span-8 col-start-5 row-[span_2_/_13]">
        <BiddingsWatchlist />
      </div>
      <div className="col-span-6 col-start-2 row-[2_/_span_4]">
        <BidHistory />
      </div>
      <div className="col-span-6 col-start-8 row-[span_5_/_11]">
        <BidAction />
      </div>
      <div className="col-span-6 col-start-8 row-[2_/_span_4]">
        <BidChat />
      </div>
      <div className="col-span-6 col-start-2 row-[span_5_/_11]">
        <BidItem />
      </div>
    </>
  )
}

// all rooms owned and joined by user
function TaggedRooms() {
  return <HeroPlaceholder>all rooms owned and joined by user</HeroPlaceholder>
}

function NotFound() {
  return <HeroPlaceholder>Not Found</HeroPlaceholder>
}
