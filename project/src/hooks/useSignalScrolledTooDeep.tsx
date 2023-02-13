import { useEffect, useRef, useState } from 'react'

function useSignalScrolledTooDeep() {
  const [scrolledTooDeep, setScrolledTooDeep] = useState<Boolean>(false)
  const refScrollingContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = refScrollingContainer.current?.scrollTop
      if (scrollPosition && scrollPosition > 150) {
        setScrolledTooDeep(true)
      } else {
        setScrolledTooDeep(false)
      }
    }
    refScrollingContainer.current?.addEventListener('scroll', handleScroll)
    return () => {
      refScrollingContainer.current?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function scrollToTop() {
    refScrollingContainer.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  return [scrolledTooDeep, refScrollingContainer, scrollToTop] as const
}

export { useSignalScrolledTooDeep }
