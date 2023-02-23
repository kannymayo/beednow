import './HeaderCountdown.css'
import clsx from 'clsx'
import { useRef, useEffect } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useCountDown } from 'ahooks'

import { useMutationSendBiddingElapsed } from '@/api/bidding'
import { useCountdownAtoms } from '@/store/useBiddingAtom'

export default function Countdown({
  endsAt,
  isEnded = false,
  isPaused = false,
  max = 60,
  updateSubscriberCountdown,
}: {
  endsAt?: Timestamp | undefined
  isEnded?: boolean
  isPaused?: boolean
  max?: number
  updateSubscriberCountdown?: (countdown: number) => void
} = {}) {
  const setCountdown = useCountdownAtoms().set()
  const [mutationSendElapsed] = useMutationSendBiddingElapsed()
  const refCountdownSanitizedLastRender = useRef<number | undefined>(undefined)
  const refShouldInstaScroll = useRef<boolean>(false)
  const countdownSettings = isPaused
    ? {
        leftTime: 0,
        interval: 5000,
      }
    : {
        targetDate: endsAt?.toDate(),
        interval: 333,
      }
  const [countdownInMs] = useCountDown({
    ...countdownSettings,
  })

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
  useEffect(() => {
    if (
      countdownSanitized === 0 &&
      refCountdownSanitizedLastRender.current === 1
    ) {
      mutationSendElapsed.mutate()
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
  if (refCountdownSanitizedLastRender.current !== undefined) {
    if (
      Math.abs(refCountdownSanitizedLastRender.current - countdownSanitized) > 5
    ) {
      refShouldInstaScroll.current = true
      setTimeout(() => {
        refShouldInstaScroll.current = false
      }, 1000)
    }
  }

  // update prev and subscriber
  useEffect(() => {
    updateSubscriberCountdown?.(countdownSanitized)
    refCountdownSanitizedLastRender.current = countdownSanitized
  }, [countdownSanitized])

  // update store
  useEffect(() => {
    setCountdown(countdownSanitized)
  }, [countdownSanitized])

  const clsTape = clsx(
    {
      'duration-1000': !refShouldInstaScroll.current,
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
