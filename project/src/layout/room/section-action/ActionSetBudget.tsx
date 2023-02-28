import clsx from 'clsx'
import { useState } from 'react'
import {
  QuestionMarkCircleIcon,
  LockOpenIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

import { useBudgetAtoms } from '@/store/useBudgetAtom'
import { useForm } from '@/hooks/form'
import { toasto } from '@/utils/toasto'
import InfoModal from '@/components/InfoModal'

export default function ActionSetBudget() {
  const setBugetAtom = useBudgetAtoms().set()
  const [isBudgetSet, setIsBudgetSet] = useState(false)
  const [fields, setFields] = useForm({
    budget: 0,
  })
  return (
    <form onSubmit={handleSubmit} className="input-group">
      <span className="input-group-text select-none gap-2">
        Budget
        <InfoModal
          title="Setting Budget"
          body="If a budget is set, you will be unable to bid above that amount"
        >
          <QuestionMarkCircleIcon className="h-4 w-4 cursor-pointer" />
        </InfoModal>
      </span>
      <input
        onChange={setFields}
        disabled={isBudgetSet}
        className={clsx(
          {
            'ring-warning disabled:border-warning ring-1 ring-inset':
              isBudgetSet,
          },
          'input w-0 flex-1 focus:outline-none'
        )}
        name="budget"
        type="number"
        placeholder="Infinity"
        size={12}
      />
      <button
        className={clsx(
          {
            'border-transparent bg-gradient-to-r from-lime-600 to-emerald-600 text-white hover:border-transparent':
              isBudgetSet,
          },
          'btn btn-warning gap-2 capitalize transition-all'
        )}
      >
        {isBudgetSet ? (
          <>
            <LockOpenIcon className="h-5 w-5" />
            Unset
          </>
        ) : (
          <>
            <LockClosedIcon className="h-5 w-5" />
            Set
          </>
        )}
      </button>
    </form>
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isBudgetSet) {
      setIsBudgetSet(false)
      setBugetAtom(-1)
    } else {
      if (!fields.budget)
        return toasto('Please enter a budget', { type: 'error' })
      setIsBudgetSet(true)
      setBugetAtom(fields.budget)
    }
  }
}
