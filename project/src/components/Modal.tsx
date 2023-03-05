import { useState, useId, cloneElement } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({
  children,
  triggerEl,
  className,
}: {
  children: (closeModal: () => void) => React.ReactNode
  triggerEl: React.ReactElement
  className?: string
}) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const TriggerEl = cloneElement(triggerEl, {
    type: 'label',
    htmlFor: id,
  })

  return (
    <>
      {TriggerEl}
      {createPortal(
        <>
          <input
            type="checkbox"
            id={id}
            className="modal-toggle"
            checked={isOpen}
            onChange={handleModalChange}
          />
          {/* MODEL BACKDROP */}
          <label htmlFor={id} className="modal cursor-pointer">
            {/* MODEL CONTAINER with overwriting ability, so clicking inside won't dismiss?*/}
            <label
              className={
                'modal-box relative flex min-h-[16rem] max-w-xl flex-col overflow-hidden md:max-w-2xl lg:max-w-4xl' +
                (className ? ' ' + className : '')
              }
              htmlFor=""
            >
              {
                // I wanted to conditionally render this part, but apparently
                // it breaks React hook rules the moment render prop includes
                // a hook.
                // A not-so-graceful solution is to pass open state down and
                // defer the conditional rendering to the children
                children(closeModal)
              }
            </label>
          </label>
        </>,
        document.body
      )}
    </>
  )

  function handleModalChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  function closeModal() {
    setIsOpen(false)
  }
}
