import BiddingsPending from './BiddingsPending'
import BiddingsWatchlist from './BiddingsWatchlist'
import BidAction from './BidAction'
import BidChat from './BidChat'
import BidHistory from './BidHistory'
import BidItem from './BidItem'

export default function Room() {
  return (
    <div className=" 4xl:px-96 grid-cols-3-1list-2details relative grid grid-rows-2 2xl:px-48">
      <div className="col-span-1 row-span-2">
        <BiddingsPending />
      </div>
      <div className="absolute right-2 top-8 bottom-8 z-10 col-span-1 col-start-3 row-span-1 row-start-1 w-28">
        <BiddingsWatchlist />
      </div>
      <div className="col-start-2 row-start-1">
        <BidHistory />
      </div>

      <div className="col-start-3 row-start-1">
        <BidChat />
      </div>
      <div className="col-start-3 row-start-2">
        <BidAction />
      </div>
      <div className="col-start-2 row-start-2">
        <BidItem />
      </div>
    </div>
  )
}
