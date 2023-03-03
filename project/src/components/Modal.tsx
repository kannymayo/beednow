import { useState, useId, cloneElement } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({
  children,
  triggerEl,
}: {
  children: (closeModal: () => void) => React.ReactNode
  triggerEl: React.ReactElement
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
              className="modal-box relative flex min-h-[16rem] max-w-xl flex-col gap-4 md:max-w-2xl lg:max-w-4xl"
              htmlFor=""
            >
              {children(closeModal)}
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
