import { toast } from 'react-toastify'

function defaultToast(...args: Parameters<typeof toast>) {
  // id in options, use it
  // else if msg is string, use first 10 chars as id
  // else serialize msg as id
  const toastId =
    args[1]?.toastId &&
    (typeof args[0] === 'string'
      ? args[0].slice(0, 10)
      : JSON.stringify(args[0]))

  toast(args[0], {
    toastId,
    containerId: 'default',
    ...args[1],
  })
}

export { defaultToast as toasto }
