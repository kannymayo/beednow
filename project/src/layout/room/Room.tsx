import SectionPending from './section-pending/BiddingsPending'
import SectionWatchlist from './section-watchlist/BiddingsWatchlist'
import SectionAction from './section-action/BiddingActions'
import SectionChat from './section-chat/BiddingChat'
import SectionOffers from './section-offers/BiddingOffers'
import SectionCurrent from './section-current/BiddingCurrent'

export default function Room() {
  return (
    <div className=" 4xl:px-96 grid-cols-3-1list-2details relative grid grid-rows-2 2xl:px-48">
      <div className="col-span-1 row-span-2">
        <SectionPending />
      </div>
      <div className="absolute right-2 top-8 bottom-8 z-10 col-span-1 col-start-3 row-span-1 row-start-1 w-28">
        <SectionWatchlist />
      </div>
      <div className="col-start-2 row-start-1">
        <SectionOffers />
      </div>

      <div className="col-start-3 row-start-1">
        <SectionChat />
      </div>
      <div className="col-start-3 row-start-2">
        <SectionAction />
      </div>
      <div className="col-start-2 row-start-2">
        <SectionCurrent />
      </div>
    </div>
  )
}
