import React from 'react'

import Header from './Header'
import ItemCollectionDone from './main/ItemCollectionDone'
import ItemCollectionPending from './main/ItemCollectionPending'
import ItemCollectionWatchList from './main/ItemCollectionWatchList'
import BidAction from './main/BidAction'
import BidChat from './main/BidChat'
import BidHistory from './main/BidHistory'
import BidItem from './main/BidItem'

export default function Home() {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="grid-rows-12 grid-cols-13 grid h-full min-h-[500px] w-full min-w-[768px]">
          <div className="col-span-13 col-start-auto">
            <Header />
          </div>
          <div className=" col-span-1 col-start-1 row-[2_/_span_11] ">
            <ItemCollectionPending />
          </div>
          <div className="col-span-8 col-start-5 row-[span_2_/_13]">
            <ItemCollectionWatchList />
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
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="bg-base-100  w-80 p-4 lg:w-1/3">
          <ItemCollectionDone />
        </div>
      </div>
    </div>
  )
}
