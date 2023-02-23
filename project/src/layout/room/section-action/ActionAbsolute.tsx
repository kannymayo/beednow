import { useState } from 'react'
import { ArrowUturnUpIcon } from '@heroicons/react/24/outline'

export default function ({
  globalDisabled,
  mutateMakeOfferAsync,
}: {
  globalDisabled: boolean
  mutateMakeOfferAsync: (amount: number) => Promise<void>
}) {
  // const highestOffer = useHighestOfferAtoms().get()
  const [absAmount, setAbsAmount] = useState(0)

  return (
    <div className=" flex flex-1 items-center justify-center">
      <div className="form-control flex-1">
        <label className="label">
          <span className="label-text">Submit your bid</span>
        </label>
        <label className="input-group input-group-sm">
          <span className="input-group-text px-2">Offer</span>
          <input
            disabled={globalDisabled}
            size={4}
            type="number"
            placeholder="Enter amount"
            className="input input-sm flex-1 focus:outline-none"
            onChange={(e) => setAbsAmount(parseInt(e.target.value) || 0)}
          />
          <button
            onClick={handleAbsoluteBid}
            disabled={globalDisabled}
            className="btn btn-sm btn-primary"
          >
            <ArrowUturnUpIcon className="h-5 w-5" />
          </button>
        </label>
      </div>
    </div>
  )

  async function handleAbsoluteBid() {
    // if (absAmount < (highestOffer?.amount || 0)) return
    await mutateMakeOfferAsync(absAmount)
  }
}
