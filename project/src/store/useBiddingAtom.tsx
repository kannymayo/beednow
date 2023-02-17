import { useEffect } from 'react'
import { useAtom, atom } from 'jotai'

import { Bidding } from '@/api/bidding'

const inProgressBiddingsAtom = atom<Bidding[] | []>([])

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

export { useInProgressBiddingsAtom }
