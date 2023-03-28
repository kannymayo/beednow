import { atom, useSetAtom, useAtomValue } from 'jotai'
import createAtomHooks from './helper/create-atom-hooks'

const budgetAtom = atom(-1)

const useBudgetAtoms = createAtomHooks(budgetAtom)

export { useBudgetAtoms }
