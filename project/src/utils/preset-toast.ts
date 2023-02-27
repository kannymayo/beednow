import { toasto } from './toasto'

// a preset toast for error messages (auth for now)
function errorToast(
  category: string,
  error: Error | null = null,
  field: string = ''
) {
  const preset = (msg: string) => {
    toasto(msg, { type: 'error', autoClose: 3000 })
  }

  if (error && field) {
    try {
      // @ts-ignore
      preset(`${category}: ${error[field]}`)
    } catch (e) {
      // @ts-ignore
      preset(`Unknown: ${e.message}`)
    }
  } else if (error) {
    try {
      preset(`General: ${error.message}`)
    } catch (e) {
      // @ts-ignore
      preset(`Unknown: ${e.message}`)
    }
  } else {
    preset(category)
  }
}

export { errorToast }
