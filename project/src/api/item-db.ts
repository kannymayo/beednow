import parse, { ItemFromAPI } from '../utils/parse-wow-tooltip'

async function fetchItem({
  queryKey,
}: {
  queryKey: [string, number]
}): Promise<ItemFromAPI> {
  const [_key, itemId] = queryKey
  const url = `https://nether.wowhead.com/tooltip/item/${itemId}?dataEnv=8&locale=0`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch item')
  const jsonRes = await res.json()
  if (jsonRes.error) throw new Error(jsonRes.error)

  return parse(jsonRes, itemId)
}

export default fetchItem
