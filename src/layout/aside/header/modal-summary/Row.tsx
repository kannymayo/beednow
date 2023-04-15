import { Bidding } from '@/api/bidding'

export default function Row({ bidding }: { bidding: Bidding }) {
  const offers = bidding.offers
  try {
    var allBidders = new Set(
      offers.filter((offer) => !offer.event).map((offer) => offer.username)
    )
  } catch (e) {
    allBidders = new Set()
  }

  return (
    <tr>
      {/* h-1 to pay tribute to table god, so child can take 100% dimension*/}
      <td className="h-1 p-0">
        <div className="flex h-full w-full">
          <div
            style={{
              backgroundImage: `url(${bidding?.details?.iconUrl})`,
            }}
            className="h-full w-10 bg-slate-500 bg-cover bg-center"
          ></div>
        </div>
      </td>
      <td>{bidding.details.name}</td>
      <td className="h-1 py-0">
        <div className="flex h-full items-center">
          <div className="avatar">
            <div
              style={{
                backgroundImage: `url(${bidding.closingUserAvatar})`,
              }}
              className="w-8 rounded-full"
            ></div>
          </div>
          {bidding.closingUsername}
        </div>
      </td>
      <td>{bidding.closingAmount}</td>
      <th>{allBidders.size}</th>
      <th></th>
      <th>
        {bidding?.closingTime
          ? bidding.closingTime.toDate().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : ''}
      </th>
    </tr>
  )
}
