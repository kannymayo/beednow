import { useRef, useEffect } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useCountDown } from 'ahooks'

import { confineToIntInRange } from '@/utils/integer'
import { useLastRendered } from '@/hooks/useLastRender'
import {
  useMutationSendBiddingElapsed,
  useMutationEndBidding,
} from '@/api/bidding'
import { useCountdownAtoms } from '@/store/useBiddingAtom'
import { useIsRoomHostAtoms } from '@/store/useRoomAtom'
import { toasto } from '@/utils/toasto'
import CountdownCircle from './countdown/CountdownCircle'

export default function Countdown({
  biddingId,
  endsAt,
  pausedAt,
  isEnded = false,
  isPaused = false,
  max = 60,
}: {
  biddingId: string
  endsAt?: Timestamp | undefined
  pausedAt?: Timestamp | undefined
  isEnded?: boolean
  isPaused?: boolean
  max?: number
}) {
  const [mutationEndBidding] = useMutationEndBidding()
  const [mutationSendBiddingElapsed] = useMutationSendBiddingElapsed()
  const setCountdown = useCountdownAtoms().set()
  const isRoomHost = useIsRoomHostAtoms().get()
  const startAutoFinish = useStartAutoFinish()

  const refCountdown = useRef(0)
  const countdownLastRendered = useLastRendered(refCountdown.current)
  const onNaturalElapsed = useOnNaturalElapsed(
    refCountdown.current,
    countdownLastRendered
  )
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

  onNaturalElapsed(() => {
    if (!isRoomHost) return
    mutationSendBiddingElapsed.mutate()
    startAutoFinish()
  })

  // if paused, use countdown from last render
  var wasOutOfRange = false
  if (!isPaused) {
    const r = confineToIntInRange(countdownInMs / 1000, 0, max)
    ;[refCountdown.current, wasOutOfRange] = r
  } else {
    if (pausedAt && endsAt) {
      // has defined pausedAt and endsAt, calc new countdown
      const remaining = endsAt?.toMillis() - pausedAt.toMillis()
      const r = confineToIntInRange(remaining / 1000, 0, max)
      ;[refCountdown.current, wasOutOfRange] = r
    } else {
      // paused and now calc to do, use last rendered
      refCountdown.current = countdownLastRendered
    }
  }
  refCountdown.current = refCountdown.current
  const isInCountdown = !isEnded && endsAt && !wasOutOfRange

  // broadcast countdown
  useEffect(() => {
    setCountdown(refCountdown.current)
  }, [refCountdown.current])

  return (
    <div className="stat overflow-hidden p-2 pb-0">
      <div className="stat-value">
        <CountdownCircle
          endsAtMillis={endsAt?.toMillis()}
          pausedAtMillis={pausedAt?.toMillis()}
          isPaused={isPaused}
          isActive={isInCountdown}
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

  function useStartAutoFinish() {
    const refWillToastCloseExecMutation = useRef(true)
    const toastId = 'auto-finish'
    return () => {
      toasto(<AutoFinishToast onAbort={onAbortAutoFinish} />, {
        onClose: () => {
          if (refWillToastCloseExecMutation.current) {
            mutationEndBidding.mutate({ id: biddingId })
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
        containerId: 'section-timeline',
        autoClose: 3000,
        type: 'success',
      })
    }

    function onAbortAutoFinish() {
      refWillToastCloseExecMutation.current = false
    }
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
    <div className="grid select-none gap-2">
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
