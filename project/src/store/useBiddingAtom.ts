import { useEffect } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'

import { Bidding } from '@/api/bidding'
import createAtomHooks from './helper/create-atom-hooks'

const biddingsAtom = atom<Bidding[] | []>([])
const inProgressBiddingsAtom = atom<Bidding[] | []>([])
const countdownAtom = atom(0)

const useCountdownAtoms = createAtomHooks(countdownAtom)

// Madness, jotai-tanstack-query provides infrastructure to better support this
//
// Not completely madness, useQueryAtom expects a primitive atom as input, and
// a readonly atom as output. It assumes that is is their job to wrap around
// useQuery() to maintain this unidirectional flow.
//
// But in our own useQuery() wrapper for Firestore, we are maintaining a 2-way
// data binding between a firestore endpoint and a queryKey.
//
// So the jotai-tanstack-query is able to wrap around standard useQuery() but
// I doubt it can wrap around our own useQuery() wrapper for Firestore.
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

const useBiddingsAtoms = createAtomHooks(biddingsAtom, {
  setFn: ({
    resetOnUnmount = false,
    biddingsAll = [],
    readyToSync = false,
  }: {
    resetOnUnmount?: boolean
    biddingsAll?: Bidding[]
    readyToSync?: boolean
  } = {}) => {
    const setBiddings = useSetAtom(biddingsAtom)
    useEffect(() => {
      if (!readyToSync || biddingsAll.length === 0) return

      setBiddings(biddingsAll)
      if (resetOnUnmount) {
        return () => {
          setBiddings([])
        }
      }
    }, [biddingsAll, readyToSync])

    return setBiddings
  },
})

const readonlyPendingBiddingsAtom = atom((get) => {
  const biddings = get(biddingsAtom)
  return biddings.filter((b) => !b.isEnded)
})

const readonlyFinishedBiddingsAtom = atom((get) => {
  const biddings = get(biddingsAtom)
  return biddings.filter((b) => b.isEnded)
})

const usePendingBiddingsAtoms = createAtomHooks(readonlyPendingBiddingsAtom)

const useFinishedBiddingsAtoms = createAtomHooks(readonlyFinishedBiddingsAtom)

export {
  useCountdownAtoms,
  useBiddingsAtoms,
  usePendingBiddingsAtoms,
  useFinishedBiddingsAtoms,
  useInProgressBiddingsAtoms,
  inProgressBiddingsAtom as _inProgressBiddingsAtom,
}
