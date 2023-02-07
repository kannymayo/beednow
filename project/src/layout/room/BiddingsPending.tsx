import { useMemo, useEffect, useState, useRef } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import useForm from '@/hooks/form'
import { useGetItems, ItemQueryData } from '@/api/useItems'

export default function BiddingsPending() {
  const [animationParent] = useAutoAnimate<HTMLUListElement>()
  const [formValues, handleFormValues] = useForm({ searchPhrase: '' })
  const items = useGetItems()

  const [showScrollToTop, setShowScrollToTop] = useState<Boolean>(false)
  const refScrollingContainer = useRef<HTMLDivElement>(null)

  console.log(items.data)

  const displayedItems = useMemo(() => {
    return filterAndSortItems(items as ItemQuery, formValues.searchPhrase)
  }, [formValues.searchPhrase, items])

  // Listen on DOM child's scroll event
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = refScrollingContainer.current?.scrollTop
      if (scrollPosition && scrollPosition > 150) {
        setShowScrollToTop(true)
      } else {
        setShowScrollToTop(false)
      }
    }
    refScrollingContainer.current?.addEventListener('scroll', handleScroll)
    return () => {
      refScrollingContainer.current?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function scrollToTop() {
    refScrollingContainer.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

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
            <li key={item.id}>
              <div className="card card-side bg-base-200  my-1 rounded-md py-0">
                <figure className="flex-shrink-0">
                  <a
                    className="h-13 w-13"
                    href="#"
                    data-wowhead={`item=${item.details.id}&domain=wrath`}
                  >
                    <img src={item.details.iconUrl} />
                  </a>
                </figure>
                <div className="card-body gap-0 overflow-hidden p-1 ">
                  <div className="flex items-center justify-between ">
                    <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                      {item.details.name}
                    </div>
                    <button className="btn btn-xs font-light">P</button>
                  </div>
                  <div className="card-actions flex-1 flex-nowrap items-center">
                    <div className="badge badge-primary shrink-0">
                      {item.details.type ?? item.details.slot}
                    </div>
                    <div className="badge badge-primary shrink-0">
                      ilvl: {item.details.itemLevel}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )

  type ItemQuery =
    | {
        data: ItemQueryData[]
      }
    | undefined
  function filterAndSortItems(items: ItemQuery, searchPhrase: string) {
    if (!items) return []
    if (!searchPhrase) return items.data
    const filteredItems = items.data.filter((item) =>
      item.details.name
        .toLowerCase()
        .includes(searchPhrase.toLowerCase().trim())
    )
    return filteredItems as ItemQueryData[] | []
  }
}
