import './ModalImporter.css'
import { forwardRef, useImperativeHandle } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

import { ItemOccurrence, IOCGroupedAction } from './Container'
import ImportableItemGroup from './importableItemGroup'
import Modal from '@/components/Modal'

function ModalImporter(
  {
    importString,
    setImportString,
    handleFillWithDemoData,
    handleAddToRoom,
    iocGrouped,
    iocGroupedDispatch,
  }: {
    importString: string
    setImportString: React.Dispatch<React.SetStateAction<string>>
    handleAddToRoom: () => void
    handleFillWithDemoData: () => void
    iocGrouped: Record<string, ItemOccurrence[]>
    iocGroupedDispatch: React.Dispatch<IOCGroupedAction>
  },
  ref: any
) {
  const validItemUniqueCount = Object.keys(iocGrouped).length
  // mathmatical smartass
  const validItemCount =
    Object.entries(iocGrouped).flat(2).length - validItemUniqueCount

  return (
    <Modal
      triggerEl={
        <label
          htmlFor="import-modal"
          className="btn btn-sm gap-2 rounded border-none bg-transparent capitalize hover:bg-indigo-500 active:bg-indigo-600"
        >
          Import
          <ArrowDownTrayIcon className="h-6 w-6" />
        </label>
      }
    >
      {(closeModal) => {
        useImperativeHandle(ref, () => ({
          closeModal: () => closeModal(),
        }))

        return (
          <>
            <h3 className="text-lg font-bold">
              Add more items for bidding
              <button
                className="btn btn-secondary btn-xs ml-5"
                onClick={handleFillWithDemoData}
              >
                Add Demo Data
              </button>
            </h3>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex max-h-96 w-full flex-1">
                {/* Import textarea */}
                <textarea
                  onChange={(e) => setImportString(e.target.value)}
                  value={importString}
                  className="textarea textarea-bordered scrollbar-hide relative m-1 flex-1 overflow-y-auto border-2 p-1 outline-0"
                  data-placeholder="Paste here your text containing item IDs."
                ></textarea>
                <div className="divider divider-horizontal"></div>
                {/* Import preview */}
                <div className="card min-h-16 subtle-scrollbar flex-1 place-items-stretch gap-2 overflow-y-auto rounded-sm px-2 py-1">
                  {Object.entries(iocGrouped).map((tuple) => (
                    <ImportableItemGroup
                      group={tuple[1] as ItemOccurrence[]}
                      id={parseInt(tuple[0])}
                      key={tuple[0]}
                      dispatch={iocGroupedDispatch}
                    />
                  ))}
                </div>
              </div>
              {/* Summary */}
              <div className="flex flex-grow-0 place-items-center justify-end gap-6">
                {importString.length > 1 && (
                  <div className="flex place-items-center gap-1">
                    Detected
                    <div className="badge badge-accent">{validItemCount}</div>
                    items of
                    <div className="badge badge-accent">
                      {validItemUniqueCount}
                    </div>
                    types
                  </div>
                )}
                {/* Confirm import */}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddToRoom}
                >
                  Import
                </button>
              </div>
            </div>
          </>
        )
      }}
    </Modal>
  )
}

export default forwardRef(ModalImporter)
