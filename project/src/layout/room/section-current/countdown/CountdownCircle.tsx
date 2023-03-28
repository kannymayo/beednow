import './CountdownCircle.css'
import { useState, useEffect } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { useMutationSendBiddingElapsed } from '@/api/bidding'
import { useCountdownAtoms } from '@/atoms/bidding'
import { useAtomIsRoomHost } from '@/atoms/room'
import { useStartAutoFinish } from './useStartAutoFinish'

export default function CountdowwnCircle({
  biddingId,
  duration,
  isPlaying = false,
  shouldRefresh = false,
  markRefreshHandled = () => undefined,
}: {
  biddingId: string
  duration: number
  isPlaying?: boolean
  shouldRefresh?: boolean
  markRefreshHandled?: () => void
}) {
  const startAutoFinish = useStartAutoFinish()
  const [mutationSendBiddingElapsed] = useMutationSendBiddingElapsed()
  const setCountdown = useCountdownAtoms().set()
  const isRoomHost = useAtomIsRoomHost().getter()
  const [timerKey, setTimerKey] = useState('')

  useEffect(() => {
    if (shouldRefresh) {
      setTimerKey(crypto.randomUUID())
      markRefreshHandled()
    }
  }, [shouldRefresh])

  return (
    <div className="flex h-full justify-center">
      <CountdownCircleTimer
        key={timerKey}
        size={90}
        isPlaying={isPlaying}
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[7, 5, 2, 0]}
        strokeWidth={6}
        rotation="clockwise"
        onUpdate={(time) => {
          setCountdown(time)
        }}
        onComplete={() => {
          if (isRoomHost) {
            startAutoFinish(biddingId)
            mutationSendBiddingElapsed.mutate()
          }
        }}
      >
        {({ remainingTime }: { remainingTime: number }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  )
}
