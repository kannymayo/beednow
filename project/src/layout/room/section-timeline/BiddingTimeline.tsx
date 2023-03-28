import './BiddingTimeline.css'
import { useRef, useEffect } from 'react'
import { toast, ToastContainer, Flip } from 'react-toastify'
import { useDebounce } from 'ahooks'

import { useProcessedOffersAtoms, useHighestOfferAtoms } from '@/atoms/offer'
import EntryOffer from './EntryOffer'
import EntryEvent from './EntryEvent'

export default function BidHistory() {
  const refLastEntry = useRef<HTMLDivElement>(null)
  const offers = useProcessedOffersAtoms().get()
  const highestOffer = useHighestOfferAtoms().get()
  const lenOffersDecounced = useDebounce(offers.length, { wait: 500 })
  const shouldHideEmptyMsg = offers.length > 0 || lenOffersDecounced > 0
  const shouldShowEndMsg = offers.length > 5
  const highestAmount = highestOffer?.amount

  useEffect(() => {
    refLastEntry.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [offers.length])

  const styleToastVariables = {
    '--toastify-toast-width': '80%',
  } as React.CSSProperties

  return (
    // toast container
    <div
      style={styleToastVariables}
      className="section-timeline h-full translate-x-0"
    >
      <div className="grid h-full w-full">
        <div className="subtle-scrollbar relative z-10 mx-1 overflow-y-auto overflow-x-hidden pl-3 pr-1 pt-1 shadow-lg">
          {/* Empty message*/}
          {!shouldHideEmptyMsg && (
            <>
              <div className="mt-6 w-full select-none text-center text-sm">
                Bids will show up here
              </div>
              <div className="divider px-12"></div>
            </>
          )}

          {/* The list of offeers */}
          <ol className="grid gap-1.5 pb-6">
            {offers.map((offer) => {
              return offer.event ? (
                <EntryEvent
                  key={offer.createdAt.toMillis()}
                  userId={offer.userId}
                  username={offer.username}
                  event={offer.event}
                  amount={offer.amount || 0}
                  numCollapsed={offer.collapsed?.length}
                />
              ) : (
                <EntryOffer
                  key={offer.createdAt.toMillis()}
                  userId={offer.userId}
                  username={offer.username}
                  userAvatar={offer.userAvatar}
                  amount={offer.amount || 0}
                  isValid={offer.isValid || false}
                  isHighest={offer.amount === highestAmount && offer.isValid}
                  numCollapsed={offer.collapsed?.length}
                />
              )
            })}
          </ol>

          {/* End indicator */}
          {shouldShowEndMsg && (
            <div
              ref={refLastEntry}
              className="divider select-none px-12 text-sm text-slate-400"
            >
              end
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        enableMultiContainer
        containerId={'section-timeline'}
        position={toast.POSITION.BOTTOM_CENTER}
        transition={Flip}
      />
    </div>
  )
}
