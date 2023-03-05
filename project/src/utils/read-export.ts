function readGeneralExport(text: string = '') {
  const regex = /\d{5}/g
  const matches = text.match(regex)
  return matches?.map((match) => parseInt(match, 10))
}

export { readGeneralExport }
