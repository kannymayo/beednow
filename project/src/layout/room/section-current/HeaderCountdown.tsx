import { useRef, useEffect } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useCountDown } from 'ahooks'

import { confineToIntInRange } from '@/utils/integer'
import { useFollowedRefPair as useLastRendered } from '@/hooks/useFollowedRefPair'
import {
  useMutationSendBiddingElapsed,
  useMutationEndBidding,
} from '@/api/bidding'
import { useCountdownAtoms } from '@/store/useBiddingAtom'
import { toast } from 'react-toastify'
import AnimatedTapedNum from './countdown/AnimatedTapedNum'

export default function Countdown({
  endsAt,
  isEnded = false,
  isPaused = false,
  max = 60,
}: {
  endsAt?: Timestamp | undefined
  isEnded?: boolean
  isPaused?: boolean
  max?: number
} = {}) {
  console.count('here')
  const [mutationEndBidding] = useMutationEndBidding()
  const [mutationSendBiddingElapsed] = useMutationSendBiddingElapsed()
  const [countdown, setCountdown] = useCountdownAtoms().getset()
  const refWillToastCloseExecMutation = useRef(true)
  const countdownSettings = isPaused
    ? {
        leftTime: 0,
        interval: 5000,
      }
    : {
        // Date instance targetDate causes way too many re-renders. Initial 20x,
        // subsequent tick 5-10X, but how come not infinite? ref:ahooks src
        // Thus we convert to ISO string here
        targetDate: endsAt?.toDate().toISOString(),
        interval: 1000,
      }
  const [countdownInMs] = useCountDown({
    ...countdownSettings,
  })

  // if paused, use countdown from last render
  // else, use countdown generated by useCountDown

  const countdownLastRendered = useLastRendered(countdown)
  var countdownSanitized: number | undefined
  var wasOutOfRange = false
  if (!isPaused) {
    ;[countdownSanitized, wasOutOfRange] = confineToIntInRange(
      countdownInMs / 1000,
      0,
      max
    )
  } else {
    countdownSanitized = countdownLastRendered
  }
  const shouldShowNumber = !isEnded && endsAt && !wasOutOfRange

  // When countdown naturally elapsed
  useEffect(() => {
    // send an elapsed event when countdown reaches 0 on trailing edge
    // also disable a "event" to start secondary countdown

    if (countdownSanitized === 0 && countdownLastRendered === 1) {
      mutationSendBiddingElapsed.mutate()
      startAutoFinish()
    }
  }, [countdownSanitized === 0, countdownLastRendered])

  // broadcast countdown
  useEffect(() => {
    setCountdown(countdownSanitized as number)
  }, [countdownSanitized])

  return (
    <div className="stat overflow-hidden p-2 pb-0">
      <div className="stat-value text-center font-mono text-7xl font-light">
        <span className="inline-flex h-[1em] overflow-y-hidden">
          <AnimatedTapedNum
            shouldShowNumber={shouldShowNumber}
            countdownLastRender={countdownLastRendered}
            countdown={countdownSanitized}
            max={max}
          ></AnimatedTapedNum>
        </span>
      </div>
      <div className="stat-desc select-none">Countdown</div>
    </div>
  )

  function startAutoFinish() {
    const toastId = 'auto-finish'
    toast(<AutoFinishToast onAbort={onAbortAutoFinish} />, {
      onClose: () => {
        if (refWillToastCloseExecMutation.current) {
          mutationEndBidding.mutate()
        }
        refWillToastCloseExecMutation.current = true
      },
      onOpen: () => {
        // Hack to get rid of onclose getting immediately fired due to React
        // StrictMode.
        // https://github.com/fkhadra/react-toastify/issues/741
        //
        // This means, onClose called within 50ms of onOpen will be no-op
        refWillToastCloseExecMutation.current = false
        setTimeout(() => {
          refWillToastCloseExecMutation.current = true
        }, 50)
      },
      toastId,
      autoClose: 3000,
    })
  }

  function onAbortAutoFinish() {
    refWillToastCloseExecMutation.current = false
  }
}

function AutoFinishToast({
  onAbort: onAbortAutoFinish,
  closeToast,
}: {
  onAbort: () => void
  closeToast?: any
}) {
  return (
    <div className="grid gap-2">
      <span>
        Current bidding will close in 3 seconds, and the next bidding will start
      </span>
      <div className="flex flex-wrap justify-end gap-2">
        <button
          onClick={() => {
            // onClose will handle the mutation
            closeToast()
          }}
          className="btn btn-sm btn-success btn-outline border-2 font-light capitalize"
        >
          Finish now
        </button>
        <button
          onClick={() => {
            onAbortAutoFinish()
            closeToast()
          }}
          className="btn btn-sm btn-warning btn-outline border-2 font-light capitalize"
        >
          Abort
        </button>
      </div>
    </div>
  )
}
