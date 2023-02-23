import {
  QuestionMarkCircleIcon,
  LockOpenIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

import InfoModal from '@/components/InfoModal'

export default function ActionSetBudget({
  globalDisabled,
}: {
  globalDisabled: boolean
}) {
  return (
    <div className="input-group">
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
        disabled={globalDisabled}
        className="input flex-1 focus:outline-none"
        type="number"
        placeholder="Infinity"
        size={12}
      />
      <button
        disabled={globalDisabled}
        className="btn btn-warning gap-2 capitalize"
      >
        <LockOpenIcon className="h-5 w-5" />
        Set
      </button>
    </div>
  )
}
