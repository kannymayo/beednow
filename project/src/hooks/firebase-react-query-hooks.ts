import { useEffect } from 'react'
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query'
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
  Firestore,
} from 'firebase/firestore'

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
function useQueryGetDoc<TQueryData>(
  queryKey: string[],
  docSegments: [Firestore, string, ...string[]],
  options: { subscribe: boolean } = { subscribe: false },
  queryOptions?: UseQueryOptions
) {
  const qc = useQueryClient()
  // assign doc ref only if all segments are truthy
  let ref: DocumentReference | undefined = undefined
  if (docSegments.every(Boolean)) {
    ref = doc(...docSegments)
  }
  const query = useQuery(
    queryKey,
    async () => {
      // use dummy document snapshot, if no valid doc ref could be formed
      let _doc
      if (ref) {
        _doc = await getDoc(ref)
      } else {
        _doc = await Promise.resolve({ data: () => undefined, id: undefined })
      }
      return {
        ..._doc.data(),
        ...(_doc.id && { id: _doc.id }),
      }
    },
    // crazy, why do I have to look into the source of useQuery to figure out what the type of queryOptions is?
    queryOptions as Omit<UseQueryOptions, 'queryKey' | 'queryFn'>
  )
  // subscribe to doc changes
  const key = JSON.stringify(queryKey)
  useEffect(() => {
    // end early if no ref or no subscribe or listener already attached
    if (!ref) return
    if (!options.subscribe) return
    if (listenerAttached.has(key)) return

    console.log('[doc] adding listener')
    listenerAttached.add(key)
    const unsubscribe = onSnapshot(ref, (_doc) => {
      console.log('[doc] listener fired')
      qc.setQueryData(queryKey, { ..._doc.data(), id: _doc.id })
    })
    return () => {
      console.log('[doc] removing listener')
      listenerAttached.delete(key)
      unsubscribe()
    }
  }, [key])
  return query as UseQueryResult<TQueryData>
}

/**
 * Collection(Query) version of useQueryGetDoc.
 */
function useQueryGetCollection<TQueryData>(
  queryKey: string[],
  collectionSegments: [Firestore, string, ...string[]],
  queryConstraints: QueryConstraint[],
  options: { subscribe: boolean } = { subscribe: false },
  queryOptions?: UseQueryOptions
) {
  const qc = useQueryClient()
  // assign query ref only if all segments are truthy
  let refQuery: Query | undefined = undefined
  if (collectionSegments.every(Boolean)) {
    const db = collectionSegments[0]
    const path = collectionSegments[1]
    const pathSegments = collectionSegments.slice(2) as string[]
    refQuery = query(collection(db, path, ...pathSegments), ...queryConstraints)
  }
  const _query = useQuery(
    queryKey,
    async () => {
      // use dummy query snapshot, if no valid doc ref could be formed
      let _docs
      if (refQuery) {
        _docs = await getDocs(refQuery)
      } else {
        _docs = await Promise.resolve({ docs: [] })
      }
      return _docs.docs.map((doc) => {
        return {
          ...doc?.data(),
          id: doc?.id,
        }
      })
    },
    queryOptions as Omit<UseQueryOptions, 'queryKey' | 'queryFn'>
  )
  // subscribe to doc changes
  const key = JSON.stringify(queryKey)
  useEffect(() => {
    // end early if no ref or no subscribe or listener already attached
    if (!refQuery) return
    if (!options.subscribe) return
    if (listenerAttached.has(key)) return

    listenerAttached.add(key)
    console.log('[collection] adding listener')
    const unsubscribe = onSnapshot(refQuery, (_docs) => {
      console.log('[collection] listener fired')
      qc.setQueryData(
        queryKey,
        _docs.docs.map((doc) => {
          return { ...doc?.data(), id: doc?.id }
        })
      )
    })
    // deps array huge problem! or unsub
    return () => {
      console.log('[collection] removing listener')
      listenerAttached.delete(key)
      unsubscribe()
    }
  }, [key])
  return _query as UseQueryResult<TQueryData>
}

export { useQueryGetDoc, useQueryGetCollection }
