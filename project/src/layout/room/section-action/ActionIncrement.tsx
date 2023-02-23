import { useEffect, useState } from 'react'
import { useDebounce } from 'ahooks'
import { useHighestOfferAtoms } from '@/store/useOfferAtom'

export default function ActionIncrement({
  globalDisabled,
  mutateMakeOfferAsync,
}: {
  mutateMakeOfferAsync: (amount: number) => Promise<void>
  globalDisabled: boolean
}) {
  const [intendedIncrement, setIntendedIncrement] = useState(0)
  const highestOffer = useHighestOfferAtoms().get()
  const intendedIncrementDebounced = useDebounce(intendedIncrement, {
    wait: 350,
  })
  const predictedAmount =
    intendedIncrementDebounced === 0
      ? 0
      : (highestOffer?.amount || 0) + intendedIncrementDebounced

  useEffect(() => {
    if (globalDisabled) {
      setIntendedIncrement(0)
    }
  }, [globalDisabled])
  return (
    <div className="form-control flex-1">
      <label className="label">
        <span className="label-text text-base">
          {predictedAmount === 0
            ? 'Choose an increment'
            : `Bid ${predictedAmount}?`}
        </span>
      </label>
      <div className="flex flex-1 flex-col justify-around">
        <button
          onClick={() => handleIncrementalBid(intendedIncrement)}
          disabled={globalDisabled}
          className="btn btn-sm btn-primary"
          value={100}
          onMouseEnter={handleMouseEnterIncrement}
          onMouseLeave={handleMouseLeaveIncrement}
        >
          +100
        </button>
        <button
          onClick={() => handleIncrementalBid(intendedIncrement)}
          disabled={globalDisabled}
          className="btn btn-sm btn-primary"
          value={500}
          onMouseEnter={handleMouseEnterIncrement}
          onMouseLeave={handleMouseLeaveIncrement}
        >
          +500
        </button>
        <button
          onClick={() => handleIncrementalBid(intendedIncrement)}
          disabled={globalDisabled}
          className="btn btn-sm btn-primary"
          value={5000}
          onMouseEnter={handleMouseEnterIncrement}
          onMouseLeave={handleMouseLeaveIncrement}
        >
          +5000
        </button>
      </div>
    </div>
  )

  async function handleIncrementalBid(amount: number) {
    await mutateMakeOfferAsync(amount + (highestOffer?.amount || 0))
  }

  function handleMouseEnterIncrement(e: any) {
    setIntendedIncrement(parseInt(e.target.value))
  }
  function handleMouseLeaveIncrement(e: any) {
    setIntendedIncrement(0)
  }
}
