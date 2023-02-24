import './HeaderCountdown.css'
import clsx from 'clsx'
import { useRef, useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useCountDown } from 'ahooks'

import { useMutationSendBiddingElapsed } from '@/api/bidding'
import { useCountdownAtoms } from '@/store/useBiddingAtom'
import { toast } from 'react-toastify'

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
  const [mutationSendBiddingElapsed] = useMutationSendBiddingElapsed()
  const setCountdown = useCountdownAtoms().set()
  const refCountdownSanitizedLastRender = useRef<number | undefined>(undefined)
  const [shouldInstaScroll, setShouldInstaScroll] = useState(false)
  const [shouldFireSecCountdown, setShouldFireSecCountdown] = useState(false)
  // const [shouldFireHandleFinish, setShouldFireHandleFinish] = useState(false)
  // const [isAutoFinishAborted, setIsAutoFinishAborted] = useState(false)
  const refSecondaryCountdownSettings = useRef({ leftTime: 0, interval: 1000 })

  // Date instance targetDate causes way too many re-renders. Initial 20x,
  // subsequent tick 5-10X, but how come not infinite?
  const countdownSettings = isPaused
    ? {
        leftTime: 0,
        interval: 5000,
      }
    : {
        // shallow comparison of Date causes extra renders. ref:ahooks src
        targetDate: endsAt?.toDate().toISOString(),
        interval: 1000,
      }
  const [countdownInMs] = useCountDown({
    ...countdownSettings,
  })
  const [secCountdownInMs] = useCountDown({
    ...refSecondaryCountdownSettings.current,
    onEnd: () => {
      // reset it, unless the secondary countdown cannot be fired for more
      // than once until remount
      refSecondaryCountdownSettings.current.leftTime = 0
      toast(
        <AutoFinishToast
          onAbortAutoFinish={onAbortAutoFinish}
          onManualFinish={onManualFinish}
        />,
        {
          onClose: () => {
            console.log('TimeElapsed?')
          },
          toastId: 'auto-finish countdown',
        }
      )
    },
  })

  // an "event handler" for starting the secondary countdown
  useEffect(() => {
    if (shouldFireSecCountdown) {
      refSecondaryCountdownSettings.current.leftTime = 3 * 1000
      setShouldFireSecCountdown(false)
    }
  }, [shouldFireSecCountdown])

  // unless paused, countdown from hook is used
  var countdownSanitized = refCountdownSanitizedLastRender.current || 0
  var wasOutOfRange = false
  if (!isPaused) {
    ;[countdownSanitized, wasOutOfRange] = confineToIntInRange(
      countdownInMs / 1000,
      0,
      max
    )
  }

  // send an elapsed event when countdown reaches 0 on trailing edge
  // also disable a "event" to start secondary countdown
  useEffect(() => {
    if (
      countdownSanitized === 0 &&
      refCountdownSanitizedLastRender.current === 1
    ) {
      mutationSendBiddingElapsed.mutate()
      setShouldFireSecCountdown(true)
    }
  }, [countdownSanitized === 0, refCountdownSanitizedLastRender.current])

  // NA is represented by "--", and to make it shown, MAX + 1 is used
  // it is specially chosen to ensure a good animation from '--' to MAX
  const shouldShowNumber = !isEnded && endsAt && !wasOutOfRange
  const valueToDriveCountdown = shouldShowNumber ? countdownSanitized : max + 1
  const numberTape = '--' + sequenceWithPrefix(max)
  const counterStyle = {
    '--max-value': max,
    '--value': valueToDriveCountdown,
  } as React.CSSProperties

  // do an instant scroll when the countdown changes by more than 5
  if (
    shouldInstaScroll === false &&
    refCountdownSanitizedLastRender.current !== undefined &&
    Math.abs(refCountdownSanitizedLastRender.current - countdownSanitized) > 5
  ) {
    setShouldInstaScroll(true)
    setTimeout(() => {
      setShouldInstaScroll(false)
    }, 1000)
  }

  // update value of last render
  useEffect(() => {
    refCountdownSanitizedLastRender.current = countdownSanitized
  }, [countdownSanitized])

  // update store
  useEffect(() => {
    setCountdown(countdownSanitized)
  }, [countdownSanitized])

  const clsTape = clsx(
    {
      'duration-1000': !shouldInstaScroll,
    },
    'relative whitespace-pre transition-all select-none'
  )
  return (
    <div className="stat overflow-hidden p-2 pb-0">
      <div className="stat-value text-center font-mono text-7xl font-light">
        <span className="custom-countdown inline-flex h-[1em] overflow-y-hidden">
          <span style={counterStyle} className={clsTape}>
            {numberTape}
          </span>
        </span>
      </div>
      <div className="stat-desc select-none">Countdown</div>
    </div>
  )
}

function sequenceWithPrefix(upto: number) {
  return range(upto, 0, -1).reduce((acc, cur) => acc + '\n' + cur, '')
}

function range(start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  )
}

function confineToIntInRange(num: number, min: number, max: number) {
  let _num = num
  _num = Math.min(Math.max(_num, min), max)
  _num = Math.round(_num)
  num = Math.round(num)
  return [_num, _num !== num] as const
}

function onManualFinish() {
  console.log('clicked: manual finish')
}
function onAbortAutoFinish() {
  console.log('clicked: abort auto finish')
}

function AutoFinishToast({
  onManualFinish,
  onAbortAutoFinish,
  closeToast,
}: {
  onManualFinish: () => void
  onAbortAutoFinish: () => void
  closeToast?: any
}) {
  return (
    <div className="grid h-16">
      <span>Auto finish and start next</span>
      <div className="flex flex-wrap justify-around">
        <button
          onClick={() => {
            onManualFinish()
            closeToast()
          }}
          className="btn btn-xs btn-success"
        >
          Finish now
        </button>
        <button
          onClick={() => {
            onAbortAutoFinish()
            closeToast()
          }}
          className="btn btn-xs btn-warning"
        >
          Abort
        </button>
      </div>
    </div>
  )
}
