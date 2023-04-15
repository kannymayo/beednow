import { useState, useId } from 'react'

/**
 * Just Pass in div and style as whatever (e.g. button). Passing in button
 * child will not work, because the modal is using non-JS hack via a label,
 * and button prevents the label from receiving click event.
 *
 * Also in the specific use case, a tailwind drop-shadow causes the element
 * to have filter applied, and that creates a containing block which causes
 * the fixed backdrop to not cover the entire screen. This is unexpected at
 * first, but it turns out quite neat to just cover the section to we make
 * no effort to change this behavior.
 *
 * If you want to change, remove that class or use a React Portal.
 */
export default function InfoModal({
  children,
  title = 'Help',
  body = 'Help message.',
}: {
  title?: string
  body?: string
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
              className="btn btn-primary btn-outline btn-sm border-2 shadow-lg"
            >
              OK
            </button>
          </div>
        </label>
      </label>
    </>
  )

  function handleConfirm() {
    setIsModalOpen(false)
  }
}
