import { Atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { atomsWithQuery } from 'jotai-tanstack-query'
import {
  doc,
  query,
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  Query,
  DocumentReference,
  QueryConstraint,
} from 'firebase/firestore'

import { qc } from '@/App'
import { db } from '@/api/firebase'
import { isVoid } from '@/utils/is-void'

/**
 * App-wide set of query keys that have listeners attached.
 *
 * I understand the useEffect hook to attach listener will be called for every component that uses this hook, but I don't understand why it would cause an infinite loop of running useEffect.
 */
const listenerAttached = new Set<string>()

/**
 * Note: You have to type assert firebaseAtomFamily. Typing atomFamily is alr
 * hard with mutulple unskipable generics, typing a variable it returns to
 * is more beyond me. You can't curry it either, because you then lose the
 * cache and the configuration isEqual check.
 *
 *
 * Note: qc is extracted from Provider and passed to atomsWithQuery() as a
 * getQueryClient callback
 *
 * What was tried and didn't work:
 *
 * 1. Use jotai-tanstack-query's recommended way of wrapping the whole app in
 *    jotai/react/Provider, docs say it should then automatically work, but it
 *    doesn't.
 *    (https://jotai.org/docs/integrations/query#referencing-the-same-instance-of-query-client-in-your-project)
 *
 * 2. Firstly, I don't understand why can't jotai just call useQueryClient() to
 *    get the same queryClient instance, we useAtom(queryClientAtom) and use it
 *    as qc.
 *
 * 3. Secondly, jotai docs show it explicitly initializes jotai-tanstack-query/
 *    queryClientAtom. If we realize it didn't atomatically make atomsWithQuery
 *    work, how about we get the value of this atom with useAtom()? still
 *    doesn't work.
 *
 * 4. Thirdly, we see getQueryClient is a callback with atom getter like a
 *    derived atom, so we call get(queryClientAtom) and return it in the
 *    callback, still doesn't work.
 *
 * Note: atomFamily() isn't a hook, but at the moment it is only used when
 * wrapped in a hook. If using useQueryClient() lead to violation of rules of
 * hook, I would very much like to use a module export of queryClient from
 * <App>
 * Update: Done switching to module export of queryClient. Perhaps not a big
 * deal, as async atoms are to used within ErrorBoundary anyway. But good to see
 * less errors in console.
 *
 */
const firebaseAtomFamily = atomFamily(
  ({
    segments,
    isSubscribed = false,
    isEnabled = true,
    queryOptions,
  }: {
    segments: (string | undefined)[]
    isSubscribed?: boolean
    isEnabled?: boolean
    queryOptions?: any
  }) => {
    let shouldEnable = false
    let refDoc: DocumentReference | null = null
    try {
      if (segments.some(isVoid)) throw new Error('Contains invalid segment.')
      const _segments = segments as string[]
      refDoc = doc(db, _segments[0], ..._segments.slice(1))
      shouldEnable = true
    } catch (e) {}
    const [dataAtom] = atomsWithQuery(
      () => ({
        queryKey: segments,
        queryFn: queryFnDoc,
        enabled: !!(isEnabled && shouldEnable),
        ...queryOptions,
        meta: {
          refDoc,
        },
      }),
      () => qc as any
    )
    // add firebase listener
    dataAtom.onMount = () => {
      const listenerKey = JSON.stringify(segments)
      if (!isSubscribed) return
      if (!refDoc) return
      if (!isEnabled || !shouldEnable) return
      if (listenerAttached.has(listenerKey)) return
      const queryKey = segments

      listenerAttached.add(listenerKey)
      const unsubscribe = onSnapshot(refDoc, (snapshotDoc) => {
        qc.setQueryData(queryKey, {
          ...snapshotDoc.data(),
          id: snapshotDoc.id,
        })
      })
      return () => {
        listenerAttached.delete(listenerKey)
        unsubscribe()
      }
    }
    return dataAtom as unknown as Atom<any>
  },
  (a, b) => {
    return (
      a.segments.join(',') === b.segments.join(',') &&
      a.isSubscribed === b.isSubscribed &&
      a.isEnabled === b.isEnabled
    )
  }
)

async function queryFnDoc({
  meta: { refDoc },
}: {
  queryKey: string[]
  meta: { refDoc: DocumentReference | null }
}) {
  if (!refDoc) throw Error('Malformed doc')

  const snapshotDoc = await getDoc(refDoc)
  if (!snapshotDoc.exists()) throw new Error('Doc does not exist.')
  return { ...snapshotDoc.data(), id: snapshotDoc.id }
}

const firebaseCollectionAtomFamily = atomFamily(
  ({
    segments,
    isSubscribed = false,
    isEnabled = true,
    queryOptions,
    queryConstraints,
  }: {
    segments: (string | undefined)[]
    isSubscribed?: boolean
    isEnabled?: boolean
    queryOptions?: any
    queryConstraints?: QueryConstraint[]
  }) => {
    let shouldEnable = false
    let refQuery: Query | null = null
    try {
      if (segments.some(isVoid)) throw new Error('Contains invalid segment.')
      const _segments = segments as string[]
      refQuery = query(
        collection(db, _segments[0], ..._segments.slice(1)),
        ...(queryConstraints || [])
      )
      shouldEnable = true
    } catch (e) {}
    const [dataAtom] = atomsWithQuery(
      () => ({
        queryKey: segments,
        queryFn: queryFnCollection,
        enabled: !!(isEnabled && shouldEnable),
        ...queryOptions,
        meta: {
          refQuery,
        },
      }),
      () => qc as any
    )

    // add firebase listener
    dataAtom.onMount = () => {
      const listenerKey = JSON.stringify(segments)
      if (!isSubscribed) return
      if (!refQuery) return
      if (!isEnabled || !shouldEnable) return
      if (listenerAttached.has(listenerKey)) return
      const queryKey = segments

      listenerAttached.add(listenerKey)
      const unsubscribe = onSnapshot(
        refQuery,
        {
          includeMetadataChanges: true,
        },
        (snapshotQuery) => {
          // we used to access pending via snapshot.metadata.pendingWrites
          // and store it in a state, here we can't as it is not a hook.
          // in a suspense style, the rewrite would have pendingWrites to be
          // reflected in a re-suspension? But how?

          // here is the attempt, not tested yet (with sequence of adding
          // to biddings)
          qc.setQueryDefaults(queryKey, {
            enabled: !snapshotQuery.metadata.hasPendingWrites,
          })
          qc.setQueryData(
            queryKey,
            snapshotQuery.docs.map((doc) => {
              return { ...doc?.data(), id: doc?.id }
            })
          )
        }
      )
      return () => {
        listenerAttached.delete(listenerKey)
        unsubscribe()
      }
    }
    return dataAtom as unknown as Atom<any>
  },
  (a, b) => {
    return (
      a.segments.join(',') === b.segments.join(',') &&
      a.isSubscribed === b.isSubscribed &&
      a.isEnabled === b.isEnabled
    )
  }
)

async function queryFnCollection({
  meta: { refQuery },
}: {
  queryKey: string[]
  meta: { refQuery: Query | null }
}) {
  if (!refQuery) throw Error('Malformed collection/query')

  const snapshotQry = await getDocs(refQuery)
  if (snapshotQry.empty) return []
  return snapshotQry.docs.map((doc) => {
    return { ...doc.data(), id: doc?.id }
  })
}

export { firebaseAtomFamily, firebaseCollectionAtomFamily }
