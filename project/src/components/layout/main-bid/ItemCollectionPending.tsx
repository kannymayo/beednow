import React, { useMemo, useEffect, useState } from 'react'
import parseTooltip, { ItemFromAPI } from '../../../utils/parse-wow-tooltip'
import useForm from '../../../hooks/form'

export default function ItemCollectionPending() {
  const [items, setItems] = useState<ItemFromAPI[]>([])
  const [showScrollToTop, setShowScrollToTop] = useState<Boolean>(false)
  const [formValues, handleFormValues] = useForm({ searchPhrase: '' })

  const itemIds = useMemo(
    () => [
      40273, 40247, 40254, 44577, 40278, 40288, 40627, 40317, 40207, 40065,
      40346, 40636, 40303, 40256, 40258, 40384,
    ],
    []
  )
  const refScrollingContainer = React.useRef<HTMLDivElement>(null)

  // fetch the result from url
  useEffect(() => {
    itemIds.forEach((id) => {
      const url = `https://nether.wowhead.com/tooltip/item/${id}?dataEnv=8&locale=0`
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const parsed = parseTooltip(data, id)
          if (items.length < 14) {
            setItems((prevState) => [...prevState, parsed])
          }
        })
    })
  }, [itemIds])

  const displayedItems = useMemo(() => {
    if (formValues) {
      const filteredItems = items.filter((item) =>
        item.name
          .toLowerCase()
          .includes(formValues.searchPhrase.toLowerCase().trim())
      )
      return filteredItems
    } else {
      return items
    }
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
      <ul>
        {displayedItems &&
          displayedItems.map((item) => (
            <li key={item.name}>
              <div className="card card-side bg-base-200  my-1 rounded-md py-0">
                <figure className="flex-shrink-0">
                  <a
                    className="h-13 w-13"
                    href="#"
                    data-wowhead={`item=${item.id}&domain=wrath`}
                  >
                    <img src={item.iconUrl} />
                  </a>
                </figure>
                <div className="card-body gap-0 overflow-hidden p-1 ">
                  <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                    {item.name}
                  </div>
                  <div className="card-actions flex-1 items-center justify-between">
                    <div className="badge badge-primary">
                      {item.type ?? item.slot}
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
