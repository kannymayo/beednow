import { useMemo, useRef } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { useForm } from '@/hooks/form'
import { useSignalScrolledTooDeep } from '@/hooks/useSignalScrolledTooDeep'
import {
  useMutationDeleteItem,
  useMutationResetBidding,
  useQueryBiddings,
  Bidding,
} from '@/api/bidding'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { useInProgressBiddingsAtom } from '@/store/useBiddingAtom'
import { factoryCompareNewerfirst } from '@/utils/factory-compare-newerfirst'
import BiddingItem from '../common/BiddingItem'

export default function BiddingsPending() {
  const [formValues, handleFormValues] = useForm({ searchPhrase: '' })
  const [showScrollToTop, refScrollingContainer, scrollToTop] =
    useSignalScrolledTooDeep()
  const [animationParent] = useAutoAnimate<HTMLUListElement>()

  const [roomId] = useRoomIdAtom()
  const [{ data: biddings, isLoading: isBiddingsLoading }, hasPendingWrites] =
    useQueryBiddings(roomId)
  const [] = useInProgressBiddingsAtom({
    resetOnUnmount: true,
    biddingsAll: biddings,
    readyToSync: !isBiddingsLoading,
  })

  const [{ mutateAsync: mutateDeleteAsync }] = useMutationDeleteItem()
  const [{ mutateAsync: mutateResetBiddingAsync }] = useMutationResetBidding({
    resetOnUnmount: true,
  })

  // if firestore has pending writes, use last saved result, because sorting
  // without serverTimestamp creates chaotic visual effect
  const refLastDisplayedBiddings = useRef<Bidding[] | undefined>(undefined)
  const displayedBiddings = useMemo(() => {
    if (hasPendingWrites) return refLastDisplayedBiddings.current

    const result = filterAndSortItems(biddings, formValues.searchPhrase)
    refLastDisplayedBiddings.current = result
    return result
  }, [formValues.searchPhrase, biddings])

  return (
    <div
      ref={refScrollingContainer}
      className="scrollbar-hide h-full overflow-y-scroll"
    >
      {/* Scroll to top */}
      {showScrollToTop && (
        <div className="sticky top-0 z-10 h-0 w-full">
          <button
            className="badge badge-accent badge-lg absolute top-10 left-1/2 -translate-x-1/2  shadow-lg transition-none transition-all hover:scale-110"
            onClick={scrollToTop}
          >
            Top
          </button>
        </div>
      )}

      {/* Header */}
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-xs btn-ghost text-xs normal-case">Pending</a>
        </div>

        {/* Search */}
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              name="searchPhrase"
              type="text"
              placeholder="Search"
              value={formValues.searchPhrase}
              onChange={handleFormValues}
              className="input input-bordered input-sm"
            />
          </div>
        </div>
      </div>

      {/* List of items */}
      <ul className="px-1" ref={animationParent}>
        {displayedBiddings?.map &&
          displayedBiddings.map((item) => (
            <BiddingItem
              item={item}
              key={item.id}
              mutateDeleteAsync={mutateDeleteAsync}
              mutateResetBiddingAsync={mutateResetBiddingAsync}
            />
          ))}
      </ul>
    </div>
  )

  function filterAndSortItems(
    items: Bidding[] | undefined,
    searchPhrase: string
  ) {
    if (!items || items.length === 0) return []
    let result = items
    if (searchPhrase) {
      result = items.filter((item) =>
        item.details.name
          .toLowerCase()
          .includes(searchPhrase.toLowerCase().trim())
      )
    }
    result.sort(factoryCompareNewerfirst(['createdAt', 'seconds']))
    const idxInProgress = result.findIndex((el) => el.isInProgress)
    const elInProgress = result.splice(idxInProgress, 1)
    result.unshift(elInProgress[0])
    return result
  }
}
