import { useRef, useEffect } from 'react'

export default function TristateCheckBox({
  status,
  onChange,
  className,
}: {
  status: 'checked' | 'unchecked' | 'indeterminate'
  onChange: any
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)

  // For DOM operations to make sense, the operation must happen after render()
  useEffect(() => {
    if (ref.current) {
      switch (status) {
        case 'checked':
          ref.current.indeterminate = false
          ref.current.checked = true
          break
        case 'unchecked':
          ref.current.indeterminate = false
          ref.current.checked = false
          break
        case 'indeterminate':
          ref.current.indeterminate = true
          break
        default:
          break
      }
    }
  }, [status])

  return (
    <input
      type="checkbox"
      className={className}
      onChange={onChange}
      ref={ref}
    ></input>
  )
}
