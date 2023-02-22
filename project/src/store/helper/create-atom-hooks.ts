import {
  useSetAtom,
  useAtomValue,
  Atom,
  PrimitiveAtom,
  WritableAtom,
  SetStateAction,
} from 'jotai'

import { SetAtom } from 'jotai/core/atom'

/**
 * In setFn, a return of of <the setter function returned by useSetAtom>,
 * short for X, is expected.
 *
 * In getFn, a return of of <the value returned by useAtomValue>, short
 * for Y, is expected.
 *
 * Therefore for getset(), we will return the tuple of [Y, X], so if you
 * custom X/Y to be different, the resulting getset() will inherit the
 * custom type.
 *
 * For now, getset() will funnel all parameters to setFn.
 */
export default function createAtomHooks<TAtom, TSetFn, TGetFn>(
  atom: PrimitiveAtom<TAtom> | Atom<TAtom>,
  options?: {
    setFn?: TSetFn
    getFn?: TGetFn
  }
) {
  if (options?.getFn !== undefined && typeof options?.getFn !== 'function') {
    throw new Error('getFn must be a function')
  }
  // unparameterized
  const get = (): TGetFn extends (...args: any) => void
    ? ReturnType<TGetFn>
    : Awaited<TAtom> => {
    if (options?.getFn !== undefined) {
      if (typeof options?.getFn !== 'function') {
        throw new Error('getFn must be a function')
      }
      return options.getFn()
    } else return useAtomValue(atom) as any
  }
  // parameterized with parameters of setFn
  const set = (
    ...params: Parameters<
      TSetFn extends (args: any) => void ? TSetFn : () => void
    >
  ): TSetFn extends (args: any) => void
    ? ReturnType<TSetFn>
    : SetAtom<SetStateAction<TAtom>, void> => {
    if (options?.setFn !== undefined) {
      if (typeof options?.setFn !== 'function') {
        throw new Error('setFn must be a function')
      }
      // don't know how typing seems turned off here
      // at least the result has correct type inference
      if (params) return options.setFn(...params)
      else return options.setFn()
    } else {
      if (isWritableAtom(atom)) {
        // conditional types works in signature
        // but it still complains here
        return useSetAtom(atom) as any
      }
      throw new Error('Atom is not writable')
    }
  }
  // parameterized with parameters of setFn
  /**
   * Much typing, very wow
   * if setFn/getFn is defined, inherit their returns and params
   * else use the basic useSetAtom/useAtomValue signature.
   */
  const getset = (
    ...params: Parameters<
      TSetFn extends (args: any) => void ? TSetFn : () => void
    >
  ): TSetFn extends (args: any) => void
    ? [
        TGetFn extends (args: any) => void
          ? ReturnType<TGetFn>
          : Awaited<TAtom>,
        ReturnType<TSetFn>
      ]
    : [
        TGetFn extends (args: any) => void
          ? ReturnType<TGetFn>
          : Awaited<TAtom>,
        SetAtom<SetStateAction<TAtom>, void>
      ] => {
    // blindly use it if setFn is provided
    if (options?.setFn !== undefined) {
      if (typeof options?.setFn !== 'function') {
        throw new Error('setFn must be a function')
      }

      if (params) var _set = options.setFn(...params)
      else _set = options.setFn()
    }
    // about to use default set hook, but check if atom is writable
    else if (!isWritableAtom(atom)) throw new Error('Atom is not writable')
    // all condition failed, use default set hook
    else _set = useSetAtom(atom) as any
    // blindly use getFn when provided
    if (options?.getFn !== undefined) {
      if (typeof options?.getFn !== 'function') {
        throw new Error('getFn must be a function')
      }
      // if setFn is defined, getFn won't receive any params
      if (params && typeof options.setFn !== 'function') {
        var _get = options.getFn(...params)
      } else _get = options.getFn()
    }
    // all condition failed, use default get hook
    else _get = useAtomValue(atom)
    return [_get, _set] as any
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
