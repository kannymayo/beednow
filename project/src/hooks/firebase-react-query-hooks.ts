import { useEffect } from 'react'
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
  segments: string[]
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
  segments: string[]
  isSubscribed?: boolean
  isEnabled?: boolean
  queryOptions?: any
}) {
  const qc = useQueryClient()
  let shouldEnable = false
  let refDoc: DocumentReference | null
  try {
    if (segments.some(isVoid)) throw new Error('Contains invalid segment.')
    refDoc = doc(db, segments[0], ...segments.slice(1))
    shouldEnable = true
  } catch (e) {}
  const query = useQuery({
    queryKey: segments,
    queryFn: queryFnDoc,
    enabled: isEnabled && shouldEnable,
    ...queryOptions,
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
  return query as UseQueryResult<TQueryData>
}

function useQueryFirebaseCollection<TQueryData>({
  segments,
  isSubscribed = false,
  isEnabled = true,
  queryOptions, // other options
  queryConstraints,
}: {
  segments: string[]
  isSubscribed?: boolean
  isEnabled?: boolean
  queryOptions?: any
  queryConstraints?: QueryConstraint[]
}) {
  const qc = useQueryClient()
  let shouldEnable = false
  let refCollection: CollectionReference | null
  try {
    if (segments.some(isVoid)) throw new Error('Contains invalid segment.')
    refCollection = collection(db, segments[0], ...segments.slice(1))
    shouldEnable = true
  } catch (e) {}
  const query = useQuery({
    queryKey: segments,
    queryFn: queryFnCollection,
    enabled: isEnabled && shouldEnable,
    ...queryOptions,
    meta: {
      queryConstraints: queryConstraints,
    },
  })

  // for triggering useEffect
  const key = JSON.stringify(segments)
  // subscribe to doc changes
  useEffect(() => {
    // end early if no ref or no subscribe or listener already attached
    if (!refCollection) return
    if (!isSubscribed) return
    if (!isEnabled || !shouldEnable) return
    if (listenerAttached.has(key)) return
    const queryKey = segments

    listenerAttached.add(key)
    const unsubscribe = onSnapshot(refCollection, (snapshotQuery) => {
      qc.setQueryData(
        queryKey,
        snapshotQuery.docs.map((doc) => {
          return { ...doc?.data(), id: doc?.id }
        })
      )
    })
    return () => {
      listenerAttached.delete(key)
      unsubscribe()
    }
  }, [key])
  return query as UseQueryResult<TQueryData>
}

async function queryFnDoc({ queryKey }: { queryKey: string[] }) {
  // Work towards an early throw, but likely we won't end up this path
  // when isEnabled is properly set
  // Alternatively, we could attempt to form a doc reference even earlier
  // and that would eliminate the need for setting isEnabled. But a bit
  // messy?
  const segments = queryKey
  let refDoc: DocumentReference | null
  try {
    refDoc = doc(db, segments[0], ...segments.slice(1))
  } catch (e) {
    refDoc = null
  }
  if (!refDoc)
    throw Error(
      `Malformed segments, could not form a valid doc reference. ${queryKey}`
    )
  // process doc
  const snapshotDoc = await getDoc(refDoc)
  return { ...snapshotDoc.data(), id: snapshotDoc.id }
}

async function queryFnCollection({
  queryKey,
  meta,
}: {
  queryKey: string[]
  meta: { queryConstraints: QueryConstraint[] }
}) {
  // work towards an early throw
  const segments = queryKey
  const queryConstraints = meta.queryConstraints
  let refFirebaseQuery: Query | null
  try {
    refFirebaseQuery = query(
      collection(db, segments[0], ...segments.slice(1)),
      ...queryConstraints
    )
  } catch (e) {
    refFirebaseQuery = null
  }
  if (!refFirebaseQuery) throw Error('Malformed collection/query')
  // process query
  const snapshotQry = await getDocs(refFirebaseQuery)
  return snapshotQry.docs.map((doc) => {
    return { ...doc?.data(), id: doc?.id }
  })
}

export { useQueryFirebase }
