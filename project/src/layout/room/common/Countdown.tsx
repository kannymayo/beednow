import './Countdown.css'
import clsx from 'clsx'
import { useState, useRef, useEffect } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useCountDown } from 'ahooks'

export default function Countdown({
  endsAt,
  pausedAt,
  isInProgress = false,
  isEnded = false,
  isPaused = false,
  max = 60,
}: {
  endsAt?: Timestamp | undefined
  pausedAt?: Timestamp | undefined
  isInProgress?: boolean
  isEnded?: boolean
  isPaused?: boolean
  max?: number
} = {}) {
  const refShouldInstaScroll = useRef<boolean>(false)
  const refPrevCountdown = useRef<number | undefined>(undefined)
  const [countdownInMs] = useCountDown({
    targetDate: endsAt?.toDate(),
  })
  const [countdown, wasOutOfRange] = confineToIntInRange(
    countdownInMs / 1000,
    0,
    max
  )
  const shouldShowNumber = isInProgress && !isEnded && endsAt && !wasOutOfRange
  // NA is represented by "--", and to make it shown, MAX + 1 is used
  // it is specially chosen to ensure a good animation from '--' to MAX
  const valueToDriveCountdown = shouldShowNumber ? countdown : max + 1
  const numberTape = '--' + sequenceWithPrefix(max)
  const counterStyle = {
    '--max-value': max,
    '--value': valueToDriveCountdown,
  } as React.CSSProperties
  if (refPrevCountdown.current) {
    // change too drastic, turn off animation
    if (Math.abs(refPrevCountdown.current - countdown) > 5) {
      // setter here causes infinite loop
      refShouldInstaScroll.current = true
      setTimeout(() => {
        refShouldInstaScroll.current = false
      }, 1000)
    }
  }
  const clsTape = clsx(
    {
      'duration-1000': !refShouldInstaScroll.current,
    },
    'relative whitespace-pre transition-all'
  )
  useEffect(() => {
    console.log('here')
    refPrevCountdown.current = countdown
  }, [countdown])

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
  return range(60, 0, -1).reduce((acc, cur) => acc + '\n' + cur, '')
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
