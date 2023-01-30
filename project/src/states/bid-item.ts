import { atom } from 'jotai'
import { BidItem } from '../utils/parse-wow-tooltip'

const allBidsAtom = atom<BidItem[]>([])

export default allBidsAtom
