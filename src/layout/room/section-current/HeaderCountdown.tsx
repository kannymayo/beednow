import { useRef, useEffect, useState } from 'react'

import { useMutationEndBidding } from '@/api/bidding'

import CountdownCircle from './countdown/CountdownCircle'

export default function Countdown({
  biddingId,
  endsAtMillis,
  pausedAtMillis,
  isEnded = false,
  isPaused = false,
}: {
  biddingId: string
  endsAtMillis?: number | undefined
  pausedAtMillis?: number | undefined
  isEnded?: boolean
  isPaused?: boolean
  max?: number
}) {
  const [mutationEndBidding] = useMutationEndBidding()
  const [duration, setDuration] = useState(0)
  const refShouldRefresh = useRef(false)
  const markRefreshHandled = () => {
    refShouldRefresh.current = false
  }

  const refLatestPausedAtMillis = useRef(pausedAtMillis)
  refLatestPausedAtMillis.current = pausedAtMillis
  const refLatestIsPaused = useRef(isPaused)
  refLatestIsPaused.current = isPaused

  const isPlaying = !!endsAtMillis && !isPaused && !isEnded

  /**
   * Change duration and refresh timer, when endsAtMillis changes. Always
   * use the latest pausedAtMillis & isPaused
   */
  useEffect(() => {
    // paused, duration is [endsAt <---> pausedAt]
    if (refLatestIsPaused.current) {
      const _endsAtMillis = endsAtMillis || Date.now()
      const _pausedAtMillis = refLatestPausedAtMillis.current || Date.now()
      setDuration((_endsAtMillis - _pausedAtMillis) / 1000)
      refShouldRefresh.current = true
    }
    // not paused, duration is [now <---> endsAt]
    else {
      const _endsAtMillis = endsAtMillis || Date.now()
      setDuration((_endsAtMillis - Date.now()) / 1000)
      refShouldRefresh.current = true
    }
  }, [endsAtMillis])

  return (
    <div className="stat overflow-hidden p-2 pb-0">
      <div className="stat-value">
        <CountdownCircle
          biddingId={biddingId}
          duration={duration}
          isPlaying={isPlaying}
          shouldRefresh={refShouldRefresh.current}
          markRefreshHandled={markRefreshHandled}
        ></CountdownCircle>
      </div>
      <div className="stat-desc select-none text-center">Countdown</div>
    </div>
  )

  function useOnNaturalElapsed(
    countdown: number,
    countdownLastRendered: number
  ) {
    const _cb = useRef<() => void>(() => undefined)

    // When countdown naturally elapsed
    useEffect(() => {
      // send an elapsed event when countdown reaches 0 on trailing edge
      // also disable a "event" to start secondary countdown
      if (countdown === 0 && countdownLastRendered === 1) {
        _cb.current()
      }
    }, [countdown === 0, countdownLastRendered])

    return (cb: any) => {
      _cb.current = cb
    }
  }
}

function useLastAndPrev<T>(tracked: T) {
  const refLagged = useRef<T>(tracked)
  const refPrevious = useRef<T | undefined>(undefined)

  return [refLagged.current, refPrevious.current]

  useEffect(() => {
    // refPrevious lags behind tracked by 1 mutation
    // From: this point
    // To: a future render phase where tracked is changed again
    // After which: it lags by 2 mutations until code reaches here
    if (refLagged.current !== tracked) {
      refPrevious.current = refLagged.current
    }
    // refLagged catches up with tracked
    // From: this point
    // To: a future render phase where tracked is changed again
    // After which: it lags behind until code reaches here
    refLagged.current = tracked
  }, [tracked])
}
