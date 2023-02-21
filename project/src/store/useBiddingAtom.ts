import { useEffect } from 'react'
import { useAtom, atom, useSetAtom, useAtomValue } from 'jotai'

import { Bidding } from '@/api/bidding'
import createAtomHooks from './helper/create-atom-hooks'

const inProgressBiddingsAtom = atom<Bidding[] | []>([])
const countdownAtom = atom(0)

const useCountdownAtoms = createAtomHooks(countdownAtom)

function useInProgressBiddingsAtom({
  resetOnUnmount = false,
  biddingsAll = [],
  readyToSync = false,
}: {
  resetOnUnmount?: boolean
  biddingsAll?: Bidding[]
  readyToSync?: boolean
} = {}) {
  const [inProgressBiddings, setInProgressBiddings] = useAtom(
    inProgressBiddingsAtom
  )
  const hasMember = inProgressBiddings.length > 0

  useEffect(() => {
    if (!readyToSync || biddingsAll.length === 0) return

    const inProgressBiddings = biddingsAll.filter((b) => b.isInProgress)
    setInProgressBiddings(inProgressBiddings)

    if (resetOnUnmount) {
      return () => {
        setInProgressBiddings([])
      }
    }
  }, [biddingsAll, readyToSync])

  return [inProgressBiddings, hasMember] as const
}
function useInProgressBiddingsAtomValue() {
  const inProgressBiddings = useAtomValue(inProgressBiddingsAtom)
  const hasMember = inProgressBiddings.length > 0
  return [inProgressBiddings, hasMember] as const
}

export {
  useInProgressBiddingsAtom,
  useInProgressBiddingsAtomValue,
  useCountdownAtoms,
  inProgressBiddingsAtom,
}
