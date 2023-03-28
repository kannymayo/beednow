import clsx from 'clsx'
import {
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  GiftIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline'

import {
  useMutationStartBidding,
  useMutationExtendBidding,
  useMutationShortenBidding,
  useMutationEndBidding,
  Bidding,
} from '@/api/bidding'
import { useCountdownAtoms } from '@/atoms/bidding'
import InfoModal from '@/components/InfoModal'
import RequiresConfirmByModal from '@/components/RequiresConfirmByModal'

export default function HostActions({ bidding }: { bidding: Bidding }) {
  const MAX_COUNTDOWN = 60
  const countdown = useCountdownAtoms().get()
  const [mutationStart] = useMutationStartBidding()
  const [mutationEnd] = useMutationEndBidding()
  const [mutationExtennd] = useMutationExtendBidding()
  const [mutationShorten] = useMutationShortenBidding()
  // "protect" countdown animation from overcapping as it is currently based on
  // static max
  const canExtend = countdown <= MAX_COUNTDOWN - 10

  return (
    <div className="col-span-1 col-start-3 row-span-1 row-start-2 ">
      <div className="flex h-full w-full flex-col items-stretch justify-around px-4">
        {/* Info modal on host actions */}
        <div className="flex items-center gap-1">
          <span className="select-none truncate text-xs opacity-70">
            Host Actions
          </span>
          <InfoModal
            title="Host Actions"
            body="As host, you have unlimited access to these 2 actions: reset, or grant more time to the bidding (even after the bidding is ended)"
          >
            <QuestionMarkCircleIcon className="ml-auto h-4 w-4 cursor-pointer" />
          </InfoModal>
        </div>
        {/* Reset */}
        <RequiresConfirmByModal
          title="Are you sure you want to reset the bidding?"
          body="This will reset the bidding to its initial state and wipe all bidding history, and will also reset the countdown to half the initial value."
          onConfirm={handleResetBidding}
        >
          <div className="btn btn-sm btn-error btn-outline w-full flex-nowrap justify-start gap-3 truncate border-2 border-slate-200 font-normal capitalize">
            <ArrowPathIcon className="h-5 w-5 shrink-0" />
            Reset
          </div>
        </RequiresConfirmByModal>
        {/* Add/Minus time */}
        <div className="input-group input-group-sm w-full flex-nowrap overflow-hidden capitalize">
          <button
            disabled={!canExtend}
            onClick={handleGrantMoreTime}
            className="btn btn-sm btn-outline border-2 border-slate-200 px-2 pr-1.5 text-green-700 hover:border-transparent hover:bg-green-700"
          >
            <PlusCircleIcon className="h-6 w-6 shrink-0" />
          </button>
          <span className="flex flex-grow select-none justify-center truncate px-1">
            10s
          </span>
          <button
            disabled={countdown <= 15}
            onClick={handleShortenBidding}
            className="btn btn-sm btn-outline border-2 border-slate-200 px-2 pl-1.5 text-rose-700 hover:border-transparent hover:bg-rose-700"
          >
            <MinusCircleIcon className="h-6 w-6 shrink-0" />
          </button>
        </div>
        {/* Finish a bidding */}
        <button
          onClick={handleFinishBidding}
          className={clsx(
            { 'btn-outline border-2 border-slate-200': countdown !== 0 },
            'btn btn-sm btn-warning w-full flex-nowrap justify-start gap-3 truncate font-normal capitalize'
          )}
        >
          <GiftIcon className="h-5 w-5 shrink-0" />
          Finish
        </button>
      </div>
    </div>
  )

  async function handleResetBidding() {
    await mutationStart.mutateAsync({
      id: bidding.id,
      initialCountdown: MAX_COUNTDOWN / 2,
      willWipeHistory: true,
    })
  }

  async function handleGrantMoreTime() {
    await mutationExtennd.mutateAsync({
      seconds: 10,
    })
  }

  async function handleShortenBidding() {
    await mutationShorten.mutateAsync({
      seconds: 10,
    })
  }

  async function handleFinishBidding() {
    await mutationEnd.mutateAsync({
      id: bidding?.id,
    })
  }
}
