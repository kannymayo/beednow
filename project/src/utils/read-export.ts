import itemsRaw from '../../mock-data/items-export'

function readWowLedgerExport() {
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

function readGeneralExport(text: string = '') {
  const regex = /\d{5}/g
  const matches = text.match(regex)
  return matches?.map((match) => parseInt(match, 10))
}

export { readGeneralExport }
export default readWowLedgerExport
