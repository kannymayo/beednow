import { ArrowUturnUpIcon } from '@heroicons/react/24/outline'

import { useBudgetAtoms } from '@/atoms/budget'
import { useForm } from '@/hooks/form'
import { toasto } from '@/utils/toasto'
import { useHighestOfferAtoms } from '@/atoms/offer'

export default function ({
  globalDisabled,
  mutateMakeOfferAsync,
}: {
  globalDisabled: boolean
  mutateMakeOfferAsync: (amount: number) => Promise<void>
}) {
  const budget = useBudgetAtoms().get()
  const highestOffer = useHighestOfferAtoms().get()
  const [fields, setFields] = useForm({
    amount: 0,
  })
  const isOverBudget = fields.amount > budget

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 items-center justify-center"
    >
      <div className="form-control flex-1">
        <label className="label">
          <span className="label-text">Submit your bid</span>
        </label>
        <label className="input-group input-group-sm flex-1">
          <span className="input-group-text px-2">Offer</span>
          <input
            disabled={globalDisabled}
            size={10}
            name="amount"
            type="number"
            placeholder="Enter amount"
            className="input input-sm w-0 flex-1 focus:outline-none"
            onChange={setFields}
          />
          <button
            disabled={globalDisabled || isOverBudget}
            className="btn btn-sm btn-primary"
          >
            <ArrowUturnUpIcon className="h-5 w-5" />
          </button>
        </label>
      </div>
    </form>
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isOverBudget) return
    if (fields.amount < (highestOffer?.amount || 0))
      return toasto('Please enter a higher amount', {
        type: 'error',
      })
    await mutateMakeOfferAsync(fields.amount)
  }
}
