import { useRef, useEffect } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useDebounce } from 'ahooks'

import { useAnnotatedOffersAtoms } from '@/store/useOfferAtom'
import EntryOffer from './EntryOffer'
import EntryEvent from './EntryEvent'

export default function BidHistory() {
  const refScrollingContainer = useRef<HTMLDivElement>(null)
  const [animationParent] = useAutoAnimate()
  const offers = useAnnotatedOffersAtoms().get()
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
          {offers.map((offer) => {
            return offer.event ? (
              <EntryEvent
                key={offer.createdAt.toMillis()}
                username={offer.username}
                event={offer.event}
                amount={offer.amount || 0}
              />
            ) : (
              <EntryOffer
                key={offer.createdAt.toMillis()}
                userId={offer.username}
                username={offer.username}
                amount={offer.amount || 0}
                isValid={offer.isValid || false}
              />
            )
          })}
        </ol>

        {/* End indicator */}
        {shouldShowEndMsg && (
          <div className="divider px-12 text-sm text-slate-400">end</div>
        )}
      </div>
    </div>
  )
}
