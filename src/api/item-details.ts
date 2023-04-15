import {
  QueryFunction,
  useQueries,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'
import parse, { ItemFromAPI, BidItem } from '@/utils/parse-wow-tooltip'

// why typing fetchItem to return a Promise<ItemFromAPI> doesn't work?
type ItemQueryFn = QueryFunction<ItemFromAPI, [string, number]>

const fetchItem: ItemQueryFn = async ({ queryKey }) => {
  const [_key, itemId] = queryKey
  const url = `https://nether.wowhead.com/tooltip/item/${itemId}?dataEnv=8&locale=0`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch item')
  const jsonRes = await res.json()
  if (jsonRes.error) throw new Error(jsonRes.error)

  return parse(jsonRes, itemId)
}

function useQueryItemDetails(id: number) {
  const query = useQuery(['itemDetails', id], fetchItem)
  return query
}

function useQueryItemDetailsMultiple(ids: number[]) {
  // don't use a query selector, it will parse on every render
  // ? maybe due to the selector function identity changing
  // yet we can't useMemo to fix the identify as the function needs
  // to access the scope variable id.
  const queries = useQueries<
    UseQueryOptions<ItemFromAPI, unknown, ItemFromAPI, [string, number]>[]
  >({
    queries: ids.map((id) => {
      return {
        queryKey: ['itemDetails', id],
        queryFn: fetchItem,
      }
    }),
  })
  return queries
}

export { useQueryItemDetails, useQueryItemDetailsMultiple }
export type { ItemFromAPI, BidItem }
