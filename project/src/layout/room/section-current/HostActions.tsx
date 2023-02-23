import {
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'

import {
  useMutationResetBidding,
  useMutationExtendBidding,
  Bidding,
} from '@/api/bidding'
import { useCountdownAtoms } from '@/store/useBiddingAtom'
import InfoModal from '@/components/InfoModal'
import RequiresConfirmByModal from '@/components/RequiresConfirmByModal'

export default function HostActions({ bidding }: { bidding: Bidding }) {
  const MAX_COUNTDOWN = 60
  const countdown = useCountdownAtoms().get()
  const [mutationReset] = useMutationResetBidding()
  const [mutationExtennd] = useMutationExtendBidding()
  // "protect" countdown animation from overcapping as it is currently based on
  // static max
  const canExtend = countdown <= MAX_COUNTDOWN - 10

  return (
    <div className="col-span-1 col-start-3 row-span-1 row-start-2 ">
      <div className="flex h-full w-full flex-col items-stretch justify-center gap-2 px-4">
        <div className="flex items-center justify-around">
          <span className="select-none text-sm opacity-70">Host Actions</span>
          <InfoModal
            title="Host Actions"
            body="As host, you have unlimited access to these 2 actions: reset, or grant more time to the bidding (even after the bidding is ended)"
          >
            <QuestionMarkCircleIcon className="ml-auto h-4 w-4 cursor-pointer" />
          </InfoModal>
        </div>
        <RequiresConfirmByModal
          title="Are you sure you want to reset the bidding?"
          body="This will reset the bidding to its initial state and wipe all bidding history, and will also reset the countdown to half the initial value."
          onConfirm={handleResetBidding}
        >
          <div className="btn btn-sm btn-warning w-full flex-nowrap justify-start gap-3 truncate capitalize">
            <ArrowPathIcon className="h-6 w-6 shrink-0" />
            Reset
          </div>
        </RequiresConfirmByModal>
        <button
          disabled={!canExtend}
          onClick={handleGrantMoreTime}
          className="btn btn-sm btn-warning w-full flex-nowrap justify-start gap-3 truncate capitalize"
        >
          <PlusCircleIcon className="h-6 w-6 shrink-0" />
          10s More
        </button>
      </div>
    </div>
  )

  async function handleResetBidding() {
    await mutationReset.mutateAsync({
      biddingId: bidding.id,
      initialCountdown: MAX_COUNTDOWN / 2,
    })
  }

  async function handleGrantMoreTime() {
    await mutationExtennd.mutateAsync({
      seconds: 10,
      base: bidding.endsAt,
    })
  }
}
