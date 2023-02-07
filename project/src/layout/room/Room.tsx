import BiddingsPending from './BiddingsPending'
import BiddingsWatchlist from './BiddingsWatchlist'
import BidAction from './BidAction'
import BidChat from './BidChat'
import BidHistory from './BidHistory'
import BidItem from './BidItem'

export default function Room() {
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
