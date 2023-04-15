import { useEffect, useState } from 'react'
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import {
  collection,
  Query,
  QueryConstraint,
  doc,
  query,
  getDoc,
  getDocs,
  onSnapshot,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore'

import { db } from '@/api/firebase'
import { isVoid } from '@/utils/is-void'

/**
 * App-wide set of query keys that have listeners attached.
 *
 * I understand the useEffect hook to attach listener will be called for every component that uses this hook, but I don't understand why it would cause an infinite loop of running useEffect.
 */
const listenerAttached = new Set<string>()

/**
 * Returns UseQueryResult for a firebase document identified by docSegments.
 *
 * Some undefine-ness can only be handled here, otherwise it violates the rules of hooks, same with the subscribe option.
 *
 *@generic TQueryData - the type of the data wrapped in a standard UseQueryResult object (data, error, isLoading, etc.)
 */
function useQueryFirebase<TQueryData>({
  segments,
  isSubscribed = false,
  isEnabled = true,
  queryOptions, // other options
  queryConstraints = [],
}: {
  segments: (string | undefined)[]
  isSubscribed?: boolean
  isEnabled?: boolean
  queryOptions?: UseQueryOptions
  queryConstraints?: QueryConstraint[]
}) {
  if (segments.length % 2 === 0) {
    return useQueryFirebaseDoc<TQueryData>({
      segments,
      isSubscribed,
      isEnabled,
      queryOptions,
    })
  } else {
    return useQueryFirebaseCollection<TQueryData>({
      segments,
      isSubscribed,
      isEnabled,
      queryOptions,
      queryConstraints,
    })
  }
}

function useQueryFirebaseDoc<TQueryData>({
  segments,
  isSubscribed = false,
  isEnabled = true,
  queryOptions, // other options
}: {
  segments: (string | undefined)[]
  isSubscribed?: boolean
  isEnabled?: boolean
  queryOptions?: any
}) {
  const qc = useQueryClient()
  let shouldEnable = false
  let refDoc: DocumentReference | null = null
  try {
    if (segments.some(isVoid)) throw new Error('Contains invalid segment.')
    const _segments = segments as string[]
    refDoc = doc(db, _segments[0], ..._segments.slice(1))

    shouldEnable = true
  } catch (e) {}
  const query = useQuery({
    queryKey: segments,
    queryFn: queryFnDoc,
    enabled: isEnabled && shouldEnable,
    ...queryOptions,
    meta: {
      refDoc,
    },
  })

  // for triggering useEffect
  const key = JSON.stringify(segments)
  // subscribe to doc changes
  useEffect(() => {
    if (!isSubscribed) return
    if (!refDoc) return
    if (!isEnabled || !shouldEnable) return
    if (listenerAttached.has(key)) return
    const queryKey = segments

    listenerAttached.add(key)
    const unsubscribe = onSnapshot(refDoc, (snapshotDoc) => {
      qc.setQueryData(queryKey, { ...snapshotDoc.data(), id: snapshotDoc.id })
    })
    return () => {
      listenerAttached.delete(key)
      unsubscribe()
    }
  }, [key])
  const _query = query as UseQueryResult<TQueryData>
  return [_query] as const
}

function useQueryFirebaseCollection<TQueryData>({
  segments,
  isSubscribed = false,
  isEnabled = true,
  queryOptions, // other options
  queryConstraints,
}: {
  segments: (undefined | string)[]
  isSubscribed?: boolean
  isEnabled?: boolean
  queryOptions?: any
  queryConstraints?: QueryConstraint[]
}) {
  const [hasPendingWrites, setHasPendingWrites] = useState(false)
  const qc = useQueryClient()

  // try forming a query reference
  let shouldEnable = false
  let refQuery: Query | null = null
  try {
    if (segments.some(isVoid)) throw new Error('Contains invalid segment.')
    // assert for now, a better isVoid would let TS know already
    const _segments = segments as string[]
    refQuery = query(
      collection(db, _segments[0], ..._segments.slice(1)),
      ...(queryConstraints || [])
    )
    // enable only when no error
    shouldEnable = true
  } catch (e) {}

  const queryKey = [...segments, JSON.stringify(queryConstraints)]
  const tanQuery = useQuery({
    queryKey,
    queryFn: queryFnCollection,
    enabled: isEnabled && shouldEnable,
    ...queryOptions,
    // queryFn no need to reform Firebase query
    meta: {
      refQuery,
    },
  })

  // for triggering useEffect
  const key = JSON.stringify(queryKey)
  // subscribe to doc changes
  useEffect(() => {
    // end early if no ref or no subscribe or listener already attached
    if (!refQuery) return
    if (!isSubscribed) return
    if (!isEnabled || !shouldEnable) return
    if (listenerAttached.has(key)) return

    listenerAttached.add(key)
    const unsubscribe = onSnapshot(
      refQuery,
      {
        includeMetadataChanges: true,
      },
      (snapshotQuery) => {
        setHasPendingWrites(snapshotQuery.metadata.hasPendingWrites)
        qc.setQueryData(
          queryKey,
          snapshotQuery.docs.map((doc) => {
            return { ...doc?.data(), id: doc?.id }
          })
        )
      }
    )
    return () => {
      listenerAttached.delete(key)
      unsubscribe()
    }
  }, [key])

  const _query = tanQuery as UseQueryResult<TQueryData>
  return [_query, hasPendingWrites] as const
}

async function queryFnDoc({
  queryKey,
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

async function queryFnCollection({
  queryKey,
  meta: { refQuery },
}: {
  queryKey: string[]
  meta: { refQuery: Query | null }
}) {
  // probably won't reach as shoudEnable is guarding
  if (!refQuery) throw Error('Malformed collection/query')

  const snapshotQry = await getDocs(refQuery)
  if (snapshotQry.empty) return []
  return snapshotQry.docs.map((doc) => {
    return { ...doc?.data(), id: doc?.id }
  })
}

export { useQueryFirebase }
