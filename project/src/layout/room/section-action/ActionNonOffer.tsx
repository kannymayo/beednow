import { HandRaisedIcon, BackwardIcon } from '@heroicons/react/24/outline'

import {
  useMutationPauseBidding,
  useMutationResumeBidding,
} from '@/api/bidding'

export default function ActionNonOffer({
  globalDisabled,
}: {
  globalDisabled: boolean
}) {
  const [mutationPause] = useMutationPauseBidding()
  const [mutationResume] = useMutationResumeBidding()

  return (
    <div className=" flex flex-col items-center justify-center gap-2">
      <button
        onClick={handlePause}
        disabled={globalDisabled}
        className="btn btn-warning btn-sm flex w-28 justify-around"
      >
        <HandRaisedIcon className="h-5 w-5" />
        Wait
      </button>
      <button
        onClick={handleResume}
        disabled={globalDisabled}
        className="btn btn-warning btn-sm flex w-28 justify-around"
      >
        <BackwardIcon className="h-5 w-5" />
        Later
      </button>
    </div>
  )

  function handlePause() {
    mutationPause.mutate()
  }
  function handleResume() {
    mutationResume.mutate()
  }
}
