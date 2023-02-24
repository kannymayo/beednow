import './AnimatedTapedNum.css'
import clsx from 'clsx'
import { useState } from 'react'

import { sequenceWithPrefix } from '@/utils/integer'

export default function AnimatedTapedNum({
  shouldShowNumber,
  countdownLastRender,
  countdown,
  max,
}: {
  shouldShowNumber: boolean | undefined
  countdownLastRender: number | undefined
  countdown: number
  max: number
}) {
  const [shouldInstaScroll, setShouldInstaScroll] = useState(false)

  // instant scroll when the countdown changes by more than 5
  if (
    shouldInstaScroll === false &&
    countdownLastRender !== undefined &&
    Math.abs(countdownLastRender - countdown) > 5
  ) {
    setShouldInstaScroll(true)
    setTimeout(() => {
      setShouldInstaScroll(false)
    }, 1000)
  }

  // NA is represented by "--", and to make it shown, MAX + 1 is used
  // it is specially chosen to ensure a good animation from '--' to MAX
  const valueToDriveCountdown = shouldShowNumber ? countdown : max + 1
  const counterStyle = {
    '--max-value': max,
    '--value': valueToDriveCountdown,
  } as React.CSSProperties
  const numberTape = '--' + sequenceWithPrefix(max)

  return (
    <span
      style={counterStyle}
      className={clsx(
        {
          'duration-1000': !shouldInstaScroll,
          'duration-150': shouldInstaScroll,
        },
        'tape relative select-none whitespace-pre transition-transform'
      )}
    >
      {numberTape}
    </span>
  )
}
