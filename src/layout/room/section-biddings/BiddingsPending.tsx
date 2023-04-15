import { useMemo, useRef } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TrashIcon, PlayCircleIcon } from '@heroicons/react/24/outline'

import { useForm } from '@/hooks/form'
import { useSignalScrolledTooDeep } from '@/hooks/useSignalScrolledTooDeep'
import {
  useMutationDeleteItem,
  useMutationStartBidding,
  useMutationResetAllInProgressBiddings,
  useQueryBiddings,
  Bidding,
} from '@/api/bidding'
import { useRoomIdAtoms } from '@/store/useRoomAtom'
import {
  useInProgressBiddingsAtoms,
  useBiddingsAtoms,
  usePendingBiddingsAtoms,
} from '@/store/useBiddingAtom'
import { factoryCompareNewerfirst } from '@/utils/factory-compare-newerfirst'
import BiddingItem from './common/BiddingItem'

export default function BiddingsPending() {
  const MAX_COUNTDOWN = 60
  const [formValues, handleFormValues] = useForm({ searchPhrase: '' })
  const [showScrollToTop, refScrollingContainer, scrollToTop] =
    useSignalScrolledTooDeep()
  const [animationParent] = useAutoAnimate<HTMLUListElement>()

  const pendingBiddings = usePendingBiddingsAtoms().get()
  const roomId = useRoomIdAtoms().get()
  // well, be a data syncer
  const [{ data: biddings, isLoading: isBiddingsLoading }, hasPendingWrites] =
    useQueryBiddings(roomId)
  useInProgressBiddingsAtoms().set({
    resetOnUnmount: true,
    biddingsAll: biddings,
    readyToSync: !isBiddingsLoading,
  })
  useBiddingsAtoms().set({
    resetOnUnmount: true,
    biddingsAll: biddings,
    readyToSync: !isBiddingsLoading,
  })

  const [{ mutateAsync: mutateDeleteAsync }] = useMutationDeleteItem()
  const [{ mutateAsync: mutateResetBiddingAsync }] =
    useMutationResetAllInProgressBiddings({
      resetOnUnmount: true,
    })
  const [{ mutateAsync: mutateStartBiddingAsync }] = useMutationStartBidding()

  // if firestore has pending writes, use last saved result, because sorting
  // without serverTimestamp creates chaotic visual effect
  const refLastDisplayedBiddings = useRef<Bidding[] | undefined>(undefined)
  const displayedBiddings = useMemo(() => {
    if (hasPendingWrites) return refLastDisplayedBiddings.current

    const result = filterAndSortItems(pendingBiddings, formValues.searchPhrase)
    refLastDisplayedBiddings.current = result
    return result
  }, [formValues.searchPhrase, pendingBiddings])

  return (
    <div
      ref={refScrollingContainer}
      className="subtle-scrollbar h-full overflow-y-scroll shadow-inner"
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
      <div className="flex h-10 items-center gap-2 px-1">
        <div className="text-center text-sm">Pending</div>

        {/* Search */}
        <input
          name="searchPhrase"
          type="text"
          placeholder="Search"
          size={6}
          value={formValues.searchPhrase}
          onChange={handleFormValues}
          className="input input-bordered input-sm flex-1 rounded-md"
        />
      </div>

      {/* List of items */}
      <ul className="px-1" ref={animationParent}>
        {displayedBiddings?.map &&
          displayedBiddings.map((item) => (
            <BiddingItem
              item={item}
              key={item.id}
              priAction={cardPrimaryAction}
              priActionHint="delete"
              priActionIcon={TrashIcon}
              secAction={cardSecondaryAction}
              secActionHint="start"
              secActionIcon={PlayCircleIcon}
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

  async function cardPrimaryAction(id: string) {
    mutateDeleteAsync(id)
  }

  async function cardSecondaryAction(id: string) {
    mutateResetBiddingAsync({ exceptBiddingId: id })
    mutateStartBiddingAsync({
      id,
      initialCountdown: MAX_COUNTDOWN,
    })
  }
}
