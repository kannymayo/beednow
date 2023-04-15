/**
 * return false, if the value is undefined, null, empty string, empty array, or empty object
 */
function isVoid(value: any) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

export { isVoid }
