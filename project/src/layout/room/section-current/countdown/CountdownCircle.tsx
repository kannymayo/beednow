import './CountdownCircle.css'
import { useState, useEffect, useRef } from 'react'
import { useUpdateEffect } from 'ahooks'

import { useLastRendered } from '@/hooks/useLastRender'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export default function AnimatedTapedNum({
  endsAtMillis,
  pausedAtMillis,
  isPaused = false,
  isActive = false,
}: {
  endsAtMillis: number | undefined
  pausedAtMillis: number | undefined
  isPaused?: boolean
  isActive?: boolean
}) {
  const endsAtMillisLastRendered = useLastRendered(endsAtMillis)
  const [pausedAtMillisLastValueful, clearPausedAtMillisLastValueful] =
    useLastValueful(pausedAtMillis)
  const [timerKey, setTimerKey] = useState('')
  const [timeToElapse, setTimeToElapse] = useState<number>(0)
  const [isElapsing, setIsElapsing] = useState(false)

  useUpdateEffect(() => {
    // when paused, stop elapsing
    if (isPaused && isElapsing) {
      setIsElapsing(false)
    }
    // when unpaused, start elapsing
    if (!isPaused && !isElapsing) {
      setIsElapsing(true)
      setTimeout(clearPausedAtMillisLastValueful, 100)
    }
  }, [isPaused])

  useUpdateEffect(() => {
    // do timeToElapse need to change?
    if (endsAtMillis && endsAtMillisLastRendered) {
      const endsDiff = endsAtMillis - endsAtMillisLastRendered
      const pauseToUnpauseDiff = Date.now() - (pausedAtMillisLastValueful || 0)

      // endtime changed due to reason other than unpause
      if (Math.abs(endsDiff - pauseToUnpauseDiff) > 1000) {
        if (isPaused) {
          // extends timeToElapse on existing timer
          setTimeToElapse(timeToElapse + endsDiff / 1000)
        } else {
          // replace timer with [now -> endsAt]
          setTimeToElapse((endsAtMillis - Date.now()) / 1000)
          setTimerKey(crypto.randomUUID())
        }
      }
    }
    // start elapsing
    if (endsAtMillis && !isElapsing && !isPaused) {
      setIsElapsing(true)
    }
  }, [endsAtMillis])

  useEffect(() => {
    if (isActive) {
      setIsElapsing(true)
      setTimerKey(crypto.randomUUID())
      setTimeToElapse(((endsAtMillis || 0) - Date.now()) / 1000)
    }
  }, [isActive])

  return (
    <div className="flex h-full justify-center">
      <CountdownCircleTimer
        key={timerKey}
        size={90}
        isPlaying={isElapsing}
        duration={timeToElapse}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[7, 5, 2, 0]}
        strokeWidth={6}
        rotation="clockwise"
      >
        {({ remainingTime }: { remainingTime: number }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  )
}

function useLastValueful(valueToTrack: number | undefined) {
  const ref = useRef<number>()
  useEffect(() => {
    if (valueToTrack && valueToTrack !== 0) {
      ref.current = valueToTrack
    }
  }, [valueToTrack])
  return [ref.current, clear] as const

  function clear() {
    ref.current = undefined
  }
}
