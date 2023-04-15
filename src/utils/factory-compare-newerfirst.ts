/**
 * Will throw from time to time, when firebase updates the local snapshot
 * optimistically, before grabbing the creation time from the server.
 *
 * And therefore, whichever throws, we assume it is the newer one.
 *
 * Still not perfect, resolution of timestamp from server could come back
 * out of order. E.g a bidding X with a newer timestamp could come back first,
 * and it would be ranked after those with unresolvable timestamp. And when
 * those are finally resolved, X would rank before them. This creates visual
 * disturbance.
 */
function factoryCompareNewerfirst(path: string[]) {
  return function (after: any, before: any) {
    // design a game where positive is returned, and only in this case,
    // the "before" element can be ordered before the "after" element.
    let afterThrows, beforeThrows
    try {
      var afterTimestamp = after
      path.forEach((key) => {
        afterTimestamp = afterTimestamp[key]
      })
    } catch (e) {
      afterThrows = true
    }
    try {
      var beforeTimestamp = before
      path.forEach((key) => {
        beforeTimestamp = beforeTimestamp[key]
      })
    } catch (e) {
      beforeThrows = true
    }
    // none throws
    if (!afterThrows && !beforeThrows) {
      return beforeTimestamp - afterTimestamp
    }
    // both throws
    if (afterThrows && beforeThrows) {
      return 0
    }
    // only after throws, assume after is newer, thus return positive
    if (afterThrows) {
      return 1
    } else {
      return -1
    }
  }
}

export { factoryCompareNewerfirst }
