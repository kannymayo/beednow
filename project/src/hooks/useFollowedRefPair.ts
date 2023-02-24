import { useRef, useEffect } from 'react'

function useFollowedRefPair<
  TInput extends string | number | boolean | undefined
>(tracked: TInput) {
  const refLastRender = useRef<TInput>(tracked)

  useEffect(() => {
    refLastRender.current = tracked
  }, [tracked])

  return refLastRender.current
}

export { useFollowedRefPair }
