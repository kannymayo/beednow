import {
  useAtom,
  useSetAtom,
  useAtomValue,
  Atom,
  PrimitiveAtom,
  WritableAtom,
  SetStateAction,
} from 'jotai'
import {} from 'jotai/utils'

export default function createAtomHooks<T>(atom: PrimitiveAtom<T> | Atom<T>) {
  const get = () => useAtomValue(atom)
  const set = () => {
    if (isWritableAtom(atom)) return useSetAtom(atom)
    throw new Error('Atom is not writable')
  }
  const getset = () => {
    if (isWritableAtom(atom)) return useAtom(atom)
    throw new Error('Atom is not writable')
  }
  return () => {
    return { get, set, getset }
  }
}

function isWritableAtom<T>(
  atom: PrimitiveAtom<T> | Atom<T>
): atom is WritableAtom<T, SetStateAction<T>> {
  return typeof (atom as PrimitiveAtom<T>).write === 'function'
}
