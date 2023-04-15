import { atom } from 'jotai'
import { produce } from 'immer'

import { factoryCompareNewerfirst } from '@/utils/factory-compare-newerfirst'
import { _inProgressBiddingsAtom as _inProgressBiddingsAtom } from './useBiddingAtom'
import { Offer } from '@/api/offer'
import createAtomHooks from './helper/create-atom-hooks'

type ExtendedOffer = Offer & { collapsed?: Offer[] }

const readonlyOffersAtom = atom((get) => {
  return get(_inProgressBiddingsAtom)[0]?.offers || []
})

const readonlyProcessedOffersAtom = atom((get) => {
  const allOffers = get(readonlyOffersAtom)
  if (allOffers.length === 0) return []

  const validatedOffers = produce(allOffers, (draft) => {
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

  const groupedOffers = validatedOffers.reduce<ExtendedOffer[]>(
    (acc: ExtendedOffer[], offer: Offer) =>
      //offer is from Firebase API, isfrozen, therefore using immer
      produce(acc, (draft) => {
        if (draft.length !== 0) {
          const size = draft.length
          if (draft[size - 1].event === offer.event) {
            // swap primary offer with incoming before collapsing, if:
            // 1) same event 2) same user 3) no event, aka bid event
            // 4) incoming event is valid
            if (
              draft[size - 1].userId === offer.userId &&
              offer.event === undefined &&
              offer.isValid
            ) {
              const oldPrimaryOfferWithoutCollapsed = { ...draft[size - 1] }
              delete oldPrimaryOfferWithoutCollapsed.collapsed
              const newPrimaryOffer = {
                ...offer,
                collapsed: [
                  ...(draft[size - 1]?.collapsed || []),
                  oldPrimaryOfferWithoutCollapsed,
                ],
              }
              draft[size - 1] = newPrimaryOffer
            }
            // normal collapse: 1) same event 2) invalid
            else if (!offer.isValid) {
              draft[size - 1].collapsed = [
                ...(draft[size - 1].collapsed || []),
                offer,
              ]
            } else {
              draft.push(offer)
            }
          } else {
            draft.push(offer)
          }
        } else {
          draft.push(offer)
        }
        return draft
      }),
    []
  )

  return groupedOffers
})

const readOnlyHighestOfferAtom = atom((get) => {
  const offers = get(readonlyProcessedOffersAtom)
  if (offers.length === 0) return undefined
  const maxAmount = Math.max(
    ...offers
      .filter((offer) => offer.event === undefined)
      .map((offer) => offer.amount || 0)
  )
  return offers.find((offer) => offer.amount === maxAmount)
})

const useProcessedOffersAtoms = createAtomHooks(readonlyProcessedOffersAtom)

const useHighestOfferAtoms = createAtomHooks(readOnlyHighestOfferAtom)

export { useProcessedOffersAtoms, useHighestOfferAtoms }
