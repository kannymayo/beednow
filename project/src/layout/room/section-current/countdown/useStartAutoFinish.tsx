import { useRef } from 'react'
import { useMutationEndBidding } from '@/api/bidding'
import { toasto } from '@/utils/toasto'

function useStartAutoFinish() {
  const [mutationEndBidding] = useMutationEndBidding()
  const refWillToastCloseExecMutation = useRef(true)
  const toastId = 'auto-finish'

  return (id: string) => {
    toasto(<AutoFinishToast onAbort={onAbortAutoFinish} />, {
      onClose: () => {
        if (refWillToastCloseExecMutation.current) {
          mutationEndBidding.mutate({ id })
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

function AutoFinishToast({
  onAbort,
  // react-toastify will pass this, for closing toast programmatically
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
            onAbort()
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

export { useStartAutoFinish }
