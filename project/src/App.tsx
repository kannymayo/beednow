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

import readExport from './utils/read-export'

function parseWowheadXML(data: string) {
  //parse into xml
  const parser = new DOMParser()
  const xml = parser.parseFromString(data, 'text/xml')

  // select json nodes
  const jsonNode = xml.getElementsByTagName('json')[0]
  const jsonEquipNode = xml.getElementsByTagName('jsonEquip')[0]

  const info = JSON.parse(`{${jsonNode.textContent}}`)
  const infoEquip = JSON.parse(`{${jsonEquipNode.textContent}}`)

  console.log(info)
  console.log(infoEquip)
}

function App() {
  const [count, setCount] = useState(0)
  const items = useMemo(() => readExport(), [])

  const itemId = items[0]

  const url = `https://cors-anywhere.leezy.workers.dev/?https://www.wowhead.com/wotlk/item=${itemId}?xml`

  // fetch the result from url
  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        parseWowheadXML(data)
      })
  }, [url])

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
          <a href="#" data-wowhead="item=40273&domain=cn.wrath">
            <BidHistory />
          </a>
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
