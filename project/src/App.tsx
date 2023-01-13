import { useState } from 'react'
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
    <div className="grid-rows-12 grid h-full min-h-[500px] w-full min-w-[768px] grid-cols-12">
      <div className="col-span-12 col-start-auto ">
        <Header />
      </div>
      <MainBid>
        <div className="col-span-2 col-start-1 row-[2_/_span_11]">
          <ItemCollectionPending />
        </div>
        <div className="col-span-2 col-start-3 row-[2_/_span_11]">
          <ItemCollectionDone />
        </div>
        <div className="col-span-8 col-start-5 row-[span_2_/_13]">
          <ItemCollectionWatchList />
        </div>
        <div className="col-span-4 col-start-5 row-[2_/_span_4]">
          <BidHistory />
        </div>
        <div className="col-span-4 col-end-13 row-[span_5_/_11]">
          <BidItem />
        </div>
        <div className="col-span-4 col-end-13 row-[2_/_span_4]">
          <BidAction />
        </div>
        <div className="col-span-4 col-start-5 row-[span_5_/_11]">
          <BidChat />
        </div>
      </MainBid>
    </div>
  )
}

export default App
