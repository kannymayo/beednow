import { useEffect, useMemo, useState } from 'react'
import './App.css'

import Header from './components/layout/Header'
import MainBid from './components/layout/MainBid'
import ItemCollectionDone from './components/layout/main-bid/ItemCollectionDone'
import ItemCollectionPending from './components/layout/main-bid/ItemCollectionPending'
import ItemCollectionWatchList from './components/layout/main-bid/ItemCollectionWatchList'
import BidAction from './components/layout/main-bid/current-bid/BidAction'
import BidChat from './components/layout/main-bid/current-bid/BidChat'
import BidHistory from './components/layout/main-bid/current-bid/BidHistory'
import BidItem from './components/layout/main-bid/current-bid/BidItem'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="grid-rows-12 grid-cols-13 grid h-full min-h-[500px] w-full min-w-[768px]">
          <div className="col-span-13 col-start-auto">
            <Header />
          </div>
          <MainBid>
            <div className="scrollbar-hide col-span-1 col-start-1 row-[2_/_span_11] overflow-y-scroll">
              <ItemCollectionPending />
            </div>
            <div className="col-span-8 col-start-5 row-[span_2_/_13]">
              <ItemCollectionWatchList />
            </div>
            <div className="col-span-6 col-start-2 row-[2_/_span_4]">
              <a href="#" data-wowhead="item=40627&domain=wrath">
                <BidHistory />
              </a>
            </div>
            <div className="col-span-6 col-start-8 row-[span_5_/_11]">
              <BidItem />
            </div>
            <div className="col-span-6 col-start-8 row-[2_/_span_4]">
              <BidAction />
            </div>
            <div className="col-span-6 col-start-2 row-[span_5_/_11]">
              <BidChat />
            </div>
          </MainBid>
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

  // return (
  //   <div className="grid-rows-12 grid h-full min-h-[500px] w-full min-w-[768px] grid-cols-12">
  //     <div className="col-span-12 col-start-auto">
  //       <Header />
  //     </div>
  //     <MainBid>
  //       <div className="col-span-2 col-start-1 row-[2_/_span_11] overflow-y-scroll">
  //         <ItemCollectionPending />
  //       </div>
  //       <div className="col-span-2 col-start-3 row-[2_/_span_11]">
  //         <ItemCollectionDone />
  //       </div>
  //       <div className="col-span-8 col-start-5 row-[span_2_/_13]">
  //         <ItemCollectionWatchList />
  //       </div>
  //       <div className="col-span-4 col-start-5 row-[2_/_span_4]">
  //         <a href="#" data-wowhead="item=40627&domain=wrath">
  //           <BidHistory />
  //         </a>
  //       </div>
  //       <div className="col-span-4 col-end-13 row-[span_5_/_11]">
  //         <BidItem />
  //       </div>
  //       <div className="col-span-4 col-end-13 row-[2_/_span_4]">
  //         <BidAction />
  //       </div>
  //       <div className="col-span-4 col-start-5 row-[span_5_/_11]">
  //         <BidChat />
  //       </div>
  //     </MainBid>
  //   </div>
  // )
}

export default App
