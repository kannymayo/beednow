import { useRef, useEffect } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { CurrencyDollarIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useDebounce } from 'ahooks'

import { useAnnotatedOffersAtomValue } from '@/store/useOfferAtom'

export default function BidHistory() {
  const refScrollingContainer = useRef<HTMLDivElement>(null)
  const [animationParent] = useAutoAnimate()
  const offers = useAnnotatedOffersAtomValue()
  const lenOffersDecounced = useDebounce(offers.length, { wait: 500 })
  const shouldHideEmptyMsg = offers.length > 0 || lenOffersDecounced > 0
  const shouldShowEndMsg = offers.length > 5

  useEffect(() => {
    const timer = setTimeout(() => {
      refScrollingContainer.current?.scrollTo({
        top: refScrollingContainer.current.scrollHeight,
        behavior: 'smooth',
      })
    }, 250)
    return () => clearTimeout(timer)
  }, [offers.length])

  return (
    <div className="grid h-full w-full">
      <div
        ref={refScrollingContainer}
        className="mx-1 overflow-y-auto overflow-x-hidden bg-slate-100 drop-shadow-lg"
      >
        {/* Empty message*/}
        {!shouldHideEmptyMsg && (
          <>
            <div className="mt-6 w-full text-center text-sm">
              Bids will show up here
            </div>
            <div className="divider px-12"></div>
          </>
        )}

        {/* The list of offeers */}
        <ol ref={animationParent} className="pb-6">
          {offers.map((offer) => (
            <li
              className="mb-1 grid h-8 grid-cols-3 border bg-white drop-shadow last:mb-0"
              key={`${offer.userId}:${offer.createdAt}`}
            >
              {/* Amount */}
              <div className="col-span-1 grid grid-cols-3  items-stretch">
                <div className="cols-span-1 flex items-center justify-center bg-gradient-to-r from-yellow-600 to-amber-600">
                  <CurrencyDollarIcon className="h-6 w-6 text-white " />
                </div>
                <span className="col-span-2 flex items-center justify-end px-2 font-mono text-lg font-thin">
                  {offer.amount}
                </span>
              </div>

              {/* User */}
              <div className="col-span-2 grid grid-cols-7">
                <div className="col-span-1 flex items-center justify-center border-x bg-gradient-to-r from-slate-400 to-zinc-400 text-white">
                  <UserCircleIcon className="h-6 w-6" />
                </div>
                <span className="col-span-6 flex items-center px-2">
                  {offer.userName}
                </span>
              </div>
            </li>
          ))}
        </ol>

        {/* End indicator */}
        {shouldShowEndMsg && (
          <div className="divider px-12 text-sm text-slate-400">end</div>
        )}
      </div>
    </div>
  )
}
