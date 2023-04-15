import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useDebounce } from 'ahooks'
import { useHighestOfferAtoms } from '@/store/useOfferAtom'
import { useUserAtoms } from '@/store/useUserAtom'
import { useBudgetAtoms } from '@/store/useBudgetAtom'

export default function ActionIncrement({
  globalDisabled,
  mutateMakeOfferAsync,
}: {
  mutateMakeOfferAsync: (amount: number) => Promise<void>
  globalDisabled: boolean
}) {
  const [intendedIncrement, setIntendedIncrement] = useState(0)
  const highestOffer = useHighestOfferAtoms().get()
  const [{ uid: selfUserId }] = useUserAtoms().get()
  const isSelfHighestOffer = highestOffer?.userId === selfUserId
  const budget = useBudgetAtoms().get()
  const intendedIncrementDebounced = useDebounce(intendedIncrement, {
    wait: 350,
  })
  const predictedAmount =
    intendedIncrementDebounced === 0
      ? 0
      : (highestOffer?.amount || 0) + intendedIncrementDebounced

  const isOverBudgetPlus100 =
    budget < 0 ? false : 100 + (highestOffer?.amount || 0) > budget
  const isOverBudgetPlus500 =
    budget < 0 ? false : 500 + (highestOffer?.amount || 0) > budget
  const isOverBudgetPlus5000 =
    budget < 0 ? false : 5000 + (highestOffer?.amount || 0) > budget

  const clsButton = clsx(
    {
      'bg-transparent text-slate-700 hover:text-white': isSelfHighestOffer,
    },
    'btn btn-sm btn-primary border-2'
  )

  useEffect(() => {
    if (globalDisabled) {
      setIntendedIncrement(0)
    }
  }, [globalDisabled])
  return (
    <div className="form-control flex-1">
      <label className="label">
        <span className="label-text min-w-0 truncate">
          {predictedAmount === 0
            ? 'Choose an increment'
            : `Bid ${predictedAmount}?`}
        </span>
      </label>

      <div className="flex flex-1 flex-col justify-around">
        <button
          onClick={() => handleIncrementalBid(intendedIncrement)}
          disabled={isOverBudgetPlus100 || globalDisabled}
          className={clsButton}
          value={100}
          onMouseEnter={handleMouseEnterIncrement}
          onMouseLeave={handleMouseLeaveIncrement}
        >
          +100
        </button>
        <button
          onClick={() => handleIncrementalBid(intendedIncrement)}
          disabled={isOverBudgetPlus500 || globalDisabled}
          className={clsButton}
          value={500}
          onMouseEnter={handleMouseEnterIncrement}
          onMouseLeave={handleMouseLeaveIncrement}
        >
          +500
        </button>
        <button
          onClick={() => handleIncrementalBid(intendedIncrement)}
          disabled={isOverBudgetPlus5000 || globalDisabled}
          className={clsButton}
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
