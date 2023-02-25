import { useRef, useEffect } from 'react'

/**
 * @param tracked Must be a state/ref/module var, otherwise it has to be
 * carefully placed for deps to work. Calling the hook too early will
 * cause the useEffect not to see the change that is yet to happen.
 */
function useLastRendered<TInput extends string | number | boolean | undefined>(
  tracked: TInput
) {
  const refLastRender = useRef<TInput>(tracked)

  useEffect(() => {
    refLastRender.current = tracked
  }, [tracked])

  return refLastRender.current
}

export { useLastRendered }
