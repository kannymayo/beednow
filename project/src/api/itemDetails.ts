import parse, { ItemFromAPI, BidItem } from '../utils/parse-wow-tooltip'
import {
  QueryFunction,
  useQueries,
  useQuery,
  UseQueryOptions,
} from 'react-query'

const fetchItem: QueryFunction<ItemFromAPI, [string, number]> = async ({
  queryKey,
}) => {
  const [_key, itemId] = queryKey
  const url = `https://nether.wowhead.com/tooltip/item/${itemId}?dataEnv=8&locale=0`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch item')
  const jsonRes = await res.json()
  if (jsonRes.error) throw new Error(jsonRes.error)

  return parse(jsonRes, itemId)
}

function useItemDetails(id: number) {
  const query = useQuery(['itemDetails', id], fetchItem)
  return query
}

function useItemDetailsMultiple(ids: number[]) {
  // don't use a query selector, it will parse on every render
  // ? maybe due to the selector function identity changing
  // yet we can't useMemo to fix the identify as the function needs
  // to access the scope variable id.
  const queries = useQueries<
    UseQueryOptions<ItemFromAPI, unknown, ItemFromAPI, [string, number]>[]
  >(
    ids.map((id) => {
      return {
        queryKey: ['itemDetails', id],
        queryFn: fetchItem,
      }
    })
  )
  return queries
}

export { useItemDetails, useItemDetailsMultiple }
export type { ItemFromAPI, BidItem }
