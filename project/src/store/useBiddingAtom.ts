import { useEffect } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'

import { Bidding } from '@/api/bidding'
import createAtomHooks from './helper/create-atom-hooks'

const inProgressBiddingsAtom = atom<Bidding[] | []>([])
const countdownAtom = atom(0)

const useCountdownAtoms = createAtomHooks(countdownAtom)

// madness, jotai-tanstack-query provides infrastructure to better support this
const useInProgressBiddingsAtoms = createAtomHooks(inProgressBiddingsAtom, {
  setFn: ({
    resetOnUnmount = false,
    biddingsAll = [],
    readyToSync = false,
  }: {
    resetOnUnmount?: boolean
    biddingsAll?: Bidding[]
    readyToSync?: boolean
  } = {}) => {
    const setInProgressBiddings = useSetAtom(inProgressBiddingsAtom)
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

    return setInProgressBiddings
  },
  getFn: () => {
    const inProgressBiddings = useAtomValue(inProgressBiddingsAtom)
    const hasMember = inProgressBiddings.length > 0
    return [inProgressBiddings, hasMember] as const
  },
})

export {
  useCountdownAtoms,
  useInProgressBiddingsAtoms,
  inProgressBiddingsAtom as _inProgressBiddingsAtom,
}
