import './Countdown.css'
import clsx from 'clsx'
import { useRef, useEffect } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useCountDown } from 'ahooks'

import { useCountdownSetAtom } from '@/store/useBiddingAtom'

export default function Countdown({
  endsAt,
  pausedAt,
  isEnded = false,
  isPaused = false,
  max = 60,
  updateSubscriberCountdown,
}: {
  endsAt?: Timestamp | undefined
  pausedAt?: Timestamp | undefined
  isEnded?: boolean
  isPaused?: boolean
  max?: number
  updateSubscriberCountdown?: (countdown: number) => void
} = {}) {
  const setCountdown = useCountdownSetAtom()
  const refShouldInstaScroll = useRef<boolean>(false)
  const refPrevCountdown = useRef<number | undefined>(undefined)
  const [countdownInMs] = useCountDown({
    targetDate: endsAt?.toDate(),
  })

  const [countdownConfined, wasOutOfRange] = confineToIntInRange(
    countdownInMs / 1000,
    0,
    max
  )
  const shouldShowNumber = !isEnded && endsAt && !wasOutOfRange
  // NA is represented by "--", and to make it shown, MAX + 1 is used
  // it is specially chosen to ensure a good animation from '--' to MAX
  const valueToDriveCountdown = shouldShowNumber ? countdownConfined : max + 1
  const numberTape = '--' + sequenceWithPrefix(max)
  const counterStyle = {
    '--max-value': max,
    '--value': valueToDriveCountdown,
  } as React.CSSProperties

  if (refPrevCountdown.current !== undefined) {
    if (Math.abs(refPrevCountdown.current - countdownConfined) > 5) {
      refShouldInstaScroll.current = true
      setTimeout(() => {
        refShouldInstaScroll.current = false
      }, 1000)
    }
  }
  // update prev and subscriber
  useEffect(() => {
    updateSubscriberCountdown?.(countdownConfined)
    refPrevCountdown.current = countdownConfined
  }, [countdownConfined])

  // update store
  useEffect(() => {
    setCountdown(countdownConfined)
  }, [countdownConfined])

  const clsTape = clsx(
    {
      'duration-1000': !refShouldInstaScroll.current,
    },
    'relative whitespace-pre transition-all select-none'
  )
  return (
    <div className="stat-value text-center font-mono text-7xl font-light">
      <span className="custom-countdown inline-flex h-[1em] overflow-y-hidden">
        <span style={counterStyle} className={clsTape}>
          {numberTape}
        </span>
      </span>
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