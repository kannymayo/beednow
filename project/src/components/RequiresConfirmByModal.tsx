import { useState, useId } from 'react'

/**
 * Just Pass in div and style as button. Passing in button child will not
 * work, because the modal is using non-JS hack via a label, and button
 * prevents the label from receiving click event.
 */
export default function RequiresConfirmByModal({
  children,
  title = 'Confirm',
  body = 'Click confirm to proceed',
  onConfirm,
}: {
  title?: string
  body?: string
  onConfirm?: () => void
  children: React.ReactNode
}) {
  const modalId = useId()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Modal Trigger */}
      <label htmlFor={modalId}>{children}</label>

      {/* Not rendered until checkbox checked */}
      <input
        type="checkbox"
        id={modalId}
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setIsModalOpen(!isModalOpen)}
      />
      {/* Backdrop, also as a label to close modal */}
      <label className="modal cursor-pointer" htmlFor={modalId}>
        {/* Modal itself */}
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="py-4">{body}</p>
          {/* Action to confirm */}
          <div className="modal-action">
            <button
              onClick={handleConfirm}
              className="btn btn-error btn-outline btn-sm border-2 shadow-lg"
            >
              Confirm
            </button>
          </div>
        </label>
      </label>
    </>
  )

  function handleConfirm() {
    setIsModalOpen(false)
    // let the modal close animation finish
    setTimeout(() => {
      if (onConfirm) onConfirm()
    }, 100)
  }
}
