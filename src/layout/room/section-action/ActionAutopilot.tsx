import {
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  FireIcon,
} from '@heroicons/react/24/outline'

import InfoModal from '@/components/InfoModal'

export default function ActionAutoPilot({
  globalDisabled,
}: {
  globalDisabled: boolean
}) {
  return (
    <div className="form-control flex-1">
      <div className=" label">
        <span className="label-text flex items-center gap-2">
          Autopilot
          <InfoModal
            title="Autopilot Mode"
            body="When in autopilot mode, system will automatically bid at the selected increment, until the budget is reached or the bid is won"
          >
            <QuestionMarkCircleIcon className="h-4 w-4 cursor-pointer" />
          </InfoModal>
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-around">
        <div className="input-group">
          <span className="input-group-text flex-1 select-none">+100</span>
          <button
            disabled={globalDisabled}
            className="btn btn-sm btn-primary gap-2 font-normal capitalize"
          >
            <RocketLaunchIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="input-group">
          <span className="input-group-text flex-1 select-none">+500</span>
          <button
            disabled={globalDisabled}
            className="btn btn-sm btn-primary gap-2 font-normal capitalize"
          >
            <RocketLaunchIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="input-group">
          <span className="input-group-text flex-1 select-none">+5000</span>
          <button
            disabled={globalDisabled}
            className="btn btn-sm btn-primary gap-2 font-normal capitalize"
          >
            <FireIcon className="h-5 w-5 hover:animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  )
}
