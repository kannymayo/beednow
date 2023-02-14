/**
 * Will throw from time to time, when firebase updates the local snapshot
 * optimistically, before grabbing the creation time from the server.
 *
 * And therefore, whichever throws, we assume it is the newer one.
 */
function factoryCompareNewerfirst(path: string[]) {
  return function (after: any, before: any) {
    // design a game where positive is returned, and only in this case,
    // the "before" element can be ordered before the "after" element.
    try {
      var afterTimestamp = after
      path.forEach((key) => {
        afterTimestamp = afterTimestamp[key]
      })
    } catch (e) {
      // "after" throws, we assume it is the newer one
      return -1
    }
    try {
      var beforeTimestamp = before
      path.forEach((key) => {
        beforeTimestamp = beforeTimestamp[key]
      })
    } catch (e) {
      return 1
    }
    return beforeTimestamp - afterTimestamp
  }
}

export { factoryCompareNewerfirst }
