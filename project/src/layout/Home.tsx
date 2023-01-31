import React from 'react'
import { Router } from 'react-router-dom'

import Header from './Header'
import BiddingsPending from './main/BiddingsPending'
import BiddingsWatchlist from './main/BiddingsWatchlist'
import BidAction from './main/BidAction'
import BidChat from './main/BidChat'
import BidHistory from './main/BidHistory'
import BidItem from './main/BidItem'

export default function Home() {
  const biddingView = (
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

  const topGrid = (
    <div className="grid-rows-12 grid-cols-13 grid h-full min-h-[500px] w-full min-w-[768px]">
      <div className="col-span-13 col-start-auto">
        <Header />
      </div>
      {biddingView}
    </div>
  )

  return topGrid
}
