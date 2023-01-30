import React, { useMemo, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import useForm from '../../../hooks/form'

import allBidsAtom from '../../../states/bid-item'

export default function ItemCollectionPending() {
  const [showScrollToTop, setShowScrollToTop] = useState<Boolean>(false)
  const [formValues, handleFormValues] = useForm({ searchPhrase: '' })

  const refScrollingContainer = React.useRef<HTMLDivElement>(null)
  const [allBids, setAllBids] = useAtom(allBidsAtom)

  const displayedItems = useMemo(() => {
    if (formValues) {
      const filteredItems = allBids.filter((item) =>
        item.details.name
          .toLowerCase()
          .includes(formValues.searchPhrase.toLowerCase().trim())
      )
      return filteredItems
    } else {
      return allBids
    }
  }, [formValues.searchPhrase, allBids])

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
      <ul>
        {displayedItems &&
          displayedItems.map((item) => (
            <li key={item.uuid}>
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
                  <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                    {item.details.name}
                  </div>
                  <div className="card-actions flex-1 items-center justify-between">
                    <div className="badge badge-primary">
                      {item.details.type ?? item.details.slot}
                    </div>
                    <button className="btn btn-xs font-light">Preview</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}
