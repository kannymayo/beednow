import { useMemo } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import useForm from '@/hooks/form'
import useSignalScrolledTooDeep from '@/hooks/useSignalScrolledTooDeep'
import { useQueryGetItems, ItemQueryData } from '@/api/items'
import BiddingItem from './common/BiddingItem'

export default function BiddingsPending() {
  const [showScrollToTop, refScrollingContainer, scrollToTop] =
    useSignalScrolledTooDeep()
  const [animationParent] = useAutoAnimate<HTMLUListElement>()
  const [formValues, handleFormValues] = useForm({ searchPhrase: '' })
  const bidItems = useQueryGetItems().data || []

  const displayedItems = useMemo(() => {
    return filterAndSortItems(bidItems, formValues.searchPhrase)
  }, [formValues.searchPhrase, bidItems])

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
        {displayedItems?.map &&
          displayedItems.map((item) => (
            <BiddingItem item={item} key={item.id} />
          ))}
      </ul>
    </div>
  )

  function filterAndSortItems(items: ItemQueryData[], searchPhrase: string) {
    if (!items) return []
    if (!searchPhrase) return items
    const filteredItems = items.filter((item) =>
      item.details.name
        .toLowerCase()
        .includes(searchPhrase.toLowerCase().trim())
    )
    return filteredItems
  }
}
