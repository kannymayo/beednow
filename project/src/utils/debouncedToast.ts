import { toast } from 'react-toastify'

// no need for custom debounce, use toastId instead
function debouncedToast(...args: Parameters<typeof toast>) {
  const id = JSON.stringify(args[0])
  if (!shouldMute(id)) {
    toast(...args)
  }
}

// not using state/atom(also a state) because setState has no effect on
// the current render and will cause read after write error
const keyedTimestamps: { [any: string]: number } = {}
function shouldMute(identifier: string, duration = 300) {
  const now = Date.now()
  let prevTimestamp = keyedTimestamps[identifier] || 0
  let _isSpamming = false

  if (now - prevTimestamp < duration) {
    _isSpamming = true
  }
  // update timestamp
  keyedTimestamps[identifier] = now
  return _isSpamming
}

export { debouncedToast }
