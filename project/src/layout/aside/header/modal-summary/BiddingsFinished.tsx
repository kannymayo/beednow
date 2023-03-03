import { DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useFinishedBiddingsAtoms } from '@/store/useBiddingAtom'
import Modal from '@/components/Modal'

export default function ModalSummary() {
  const finishedBiddings = useFinishedBiddingsAtoms().get()

  const totalFinishedBiddings = finishedBiddings.length
  const totalFinishedAmount = finishedBiddings.reduce(
    (acc, cur) => acc + (cur.closingAmount || 0),
    0
  )

  return (
    <>
      <Modal
        triggerEl={
          <label
            htmlFor="finished-modal"
            className="btn btn-sm gap-1 rounded border-none bg-transparent capitalize hover:bg-indigo-500 active:bg-indigo-600"
          >
            {totalFinishedAmount > 0
              ? `Total: ${totalFinishedAmount}(${totalFinishedBiddings})`
              : 'Finished'}
            <DocumentCheckIcon className="h-6 w-6" />
          </label>
        }
      >
        {(closeModal) => {
          return (
            <>
              <h3 className="text-lg font-bold">Finished Biddings</h3>
              <p className="py-4">
                Est invidunt no labore sea sed, stet no stet aliquyam clita,
                labore et sed dolor labore diam amet, et at.
              </p>
            </>
          )
        }}
      </Modal>
    </>
  )
}
