import itemsRaw from '../../mock-data/items-export'

export default function readExport() {
  const items = itemsRaw.split('\n')
  // extract whats between the first set of square brackets
  items.map((item, index) => {
    const itemMatch = item.match(/\[(.*?)\]/)
    if (itemMatch) {
      items[index] = itemMatch[1]
    }
  })

  // extract whats between the first set of brackets
  items.map((item, index) => {
    const itemMatch = item.match(/\((.*?)\)/)
    if (itemMatch) {
      items[index] = itemMatch[1]
    }
  })

  return items
}
