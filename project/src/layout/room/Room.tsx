import BiddingsPending from './BiddingsPending'
import BiddingsWatchlist from './BiddingsWatchlist'
import BidAction from './BidAction'
import BidChat from './BidChat'
import BidHistory from './BidHistory'
import BidItem from './BidItem'

export default function Room() {
  return (
    <div className=" 4xl:px-96 grid-cols-3-1list-2details grid-rows-3-2details-1list grid 2xl:px-48">
      <div className="col-span-1 row-span-3">
        <BiddingsPending />
      </div>
      <div className=" col-start-2 row-start-3">
        <BiddingsWatchlist />
      </div>
      <div className="col-start-2 row-start-1">
        <BidHistory />
      </div>
      <div className="col-start-3 row-start-2">
        <BidAction />
      </div>
      <div className="col-start-3 row-start-1">
        <BidChat />
      </div>
      <div className="col-start-2 row-start-2">
        <BidItem />
      </div>
    </div>
  )
}
