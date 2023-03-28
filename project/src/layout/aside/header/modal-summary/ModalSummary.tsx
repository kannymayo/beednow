import { DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useFinishedBiddingsAtoms } from '@/atoms/bidding'
import Modal from '@/components/Modal'
import SummaryBody from './Summary'

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
        className="h-5/6"
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
        {(closeModal) => (
          <SummaryBody
            closeModal={closeModal}
            finishedBiddings={finishedBiddings}
          />
        )}
      </Modal>
    </>
  )
}
