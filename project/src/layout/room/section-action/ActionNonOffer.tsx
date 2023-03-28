import clsx from 'clsx'
import {
  HandRaisedIcon,
  BackwardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

import {
  useMutationPauseBidding,
  useMutationResumeBidding,
} from '@/api/bidding'
import { useInProgressBiddingsAtoms } from '@/atoms/bidding'

export default function ActionNonOffer({
  globalDisabled,
}: {
  globalDisabled: boolean
}) {
  const [mutationPause] = useMutationPauseBidding()
  const [mutationResume] = useMutationResumeBidding()
  const [[bidding]] = useInProgressBiddingsAtoms().get()
  const isPaused = bidding?.isPaused || false

  const clsPauseBtn = clsx(
    {
      'bg-gradient-to-r from-lime-600 to-emerald-600 border-none': isPaused,
      'btn-warning': !isPaused,
    },
    'btn btn-sm flex w-28 justify-start gap-2 capitalize font-light'
  )
  return (
    <div className=" flex flex-col items-center justify-center gap-2">
      <button
        onClick={handlePauseResume}
        disabled={globalDisabled}
        className={clsPauseBtn}
      >
        {isPaused ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <HandRaisedIcon className="h-5 w-5" />
        )}
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button
        disabled={globalDisabled}
        className="btn btn-warning btn-sm flex w-28 justify-start gap-2 font-light capitalize"
      >
        <BackwardIcon className="h-5 w-5" />
        Later
      </button>
    </div>
  )

  function handlePauseResume() {
    if (isPaused) {
      mutationResume.mutate()
    } else {
      mutationPause.mutate()
    }
  }
}
