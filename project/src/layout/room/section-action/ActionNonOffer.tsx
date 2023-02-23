import { HandRaisedIcon, BackwardIcon } from '@heroicons/react/24/outline'

export default function ActionNonOffer({
  globalDisabled,
}: {
  globalDisabled: boolean
}) {
  return (
    <div className=" flex flex-col items-center justify-center gap-2">
      <button
        disabled={globalDisabled}
        className="btn btn-warning btn-sm flex w-28 justify-around"
      >
        <HandRaisedIcon className="h-5 w-5" />
        Wait
      </button>
      <button
        disabled={globalDisabled}
        className="btn btn-warning btn-sm flex w-28 justify-around"
      >
        <BackwardIcon className="h-5 w-5" />
        Later
      </button>
    </div>
  )
}
