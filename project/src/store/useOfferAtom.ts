import { atom } from 'jotai'
import { produce } from 'immer'

import { factoryCompareNewerfirst } from '@/utils/factory-compare-newerfirst'
import { _inProgressBiddingsAtom as _inProgressBiddingsAtom } from './useBiddingAtom'
import createAtomHooks from './helper/create-atom-hooks'

const readOnlyOffersAtom = atom((get) => {
  return get(_inProgressBiddingsAtom)[0]?.offers || []
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
      // skip events
      if (draft[i].event) {
        continue
      }
      if ((draft[i].amount || 0) > curMax) {
        curMax = draft[i].amount || 0
        draft[i].isValid = true
      } else draft[i].isValid = false
    }
  })
})
const readOnlyHighestOfferAtom = atom((get) => {
  const offers = get(roOffersSortedAnnotatedAtom)
  if (offers.length === 0) return undefined
  const maxAmount = Math.max(
    ...offers
      .filter((offer) => offer.event === undefined)
      .map((offer) => offer.amount || 0)
  )
  return offers.find((offer) => offer.amount === maxAmount)
})

const useAnnotatedOffersAtoms = createAtomHooks(roOffersSortedAnnotatedAtom)

const useHighestOfferAtoms = createAtomHooks(readOnlyHighestOfferAtom)

export { useAnnotatedOffersAtoms, useHighestOfferAtoms }
