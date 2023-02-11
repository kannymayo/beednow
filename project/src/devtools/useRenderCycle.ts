import { useRef, useEffect } from 'react'

export default function useRenderCycle(name?: string) {
  const refRenderCount = useRef(0)
  const nameSegment = name ? `[${name}]` : ''

  useEffect(() => {
    refRenderCount.current += 1
  })
  console.log(`[render ${refRenderCount.current}]${nameSegment} `)
}
