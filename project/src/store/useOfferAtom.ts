import { useAtomValue, atom } from 'jotai'
import { produce } from 'immer'

import { factoryCompareNewerfirst } from '@/utils/factory-compare-newerfirst'
import { inProgressBiddingsAtom } from './useBiddingAtom'

const readOnlyOffersAtom = atom((get) => {
  return get(inProgressBiddingsAtom)[0]?.offers || []
})

const roOffersSortedAnnotatedAtom = atom((get) => {
  const allOffers = get(readOnlyOffersAtom)
  if (allOffers.length === 0) return []

  return produce(allOffers, (draft) => {
    // loop from earliest to latest
    draft.sort(factoryCompareNewerfirst(['createdAt'])).reverse()
    // a later offer is invalid if it is lower than any earlier offer
    let curMax = 0
    for (let i = 0; i < draft.length; i++) {
      if (draft[i].amount > curMax) {
        curMax = draft[i].amount
        draft[i].isValid = true
      } else draft[i].isValid = false
    }
  })
})

const readOnlyHighestOfferAtom = atom((get) => {
  const offers = get(roOffersSortedAnnotatedAtom)
  if (offers.length === 0) return undefined
  const maxAmount = Math.max(...offers.map((offer) => offer.amount))
  return offers.find((offer) => offer.amount === maxAmount)
})

function useAnnotatedOffersAtomValue() {
  return useAtomValue(roOffersSortedAnnotatedAtom)
}

function useHighestOfferAtomValue() {
  return useAtomValue(readOnlyHighestOfferAtom)
}

export { useAnnotatedOffersAtomValue, useHighestOfferAtomValue }