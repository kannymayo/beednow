import './ImportModal.css'
import React, { Fragment, useState, useEffect, useRef } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { useQueries } from 'react-query'

import fetchItem from '../../../api/item-db'
import ImportableItem from './ImportableItem'
import { readGeneralExport } from '../../../utils/read-export'
import { ItemFromAPI } from '../../../utils/parse-wow-tooltip'

export default function ImportModal({
  isOpen = false,
  closeModal,
}: {
  isOpen: boolean
  closeModal: () => void
}) {
  // const itemIds = [
  //   40273, 40247, 40254, 44577, 40278, 40288, 40627, 40317, 40207, 40065, 40346,
  //   40636, 40303, 40256, 40258, 40384,
  // ]
  const [idList, setIdList] = useState<number[]>([])
  const [uniqueIds, setUniqueIds] = useState<number[]>([])
  const [idOccurrences, setIdOccurrences] = useState<
    Map<string, { count: number }>
  >(new Map())
  const [itemDetails, setItemDetails] = useState<Map<number, ItemFromAPI>>(
    new Map()
  )
  const [importString, setImportString] = useState('')
  const editableDivRef = useRef<HTMLDivElement>(null)

  // likely wrong type
  const results = useQueries<Array<{ queryKey: [string, number] }>>(
    idList.map((id) => ({
      queryKey: ['item', id],
      queryFn: fetchItem,
    }))
  )

  // construct dict of <id, item detail>
  results.map((q) => {
    if (q.data) {
      const item = q.data as ItemFromAPI
      if (!itemDetails.has(item.id)) {
        setItemDetails((prev) => {
          const newMap = new Map(prev)
          newMap.set(item.id, item)
          return newMap
        })
      }
    }
  })

  // detect and verify valid item ids
  useEffect(() => {
    const ids = readGeneralExport(importString)
    if (ids !== undefined) {
      setIdList(ids)
    }
  }, [importString])

  // compute unique ids
  useEffect(() => {
    const unique = [...new Set(idList)]
    setUniqueIds(unique)
  }, [idList])

  // compute id occurrences
  useEffect(() => {
    idList.forEach((id) => {
      if (idOccurrences) {
        if (!idOccurrences.has(`${id}#0`)) {
          // create the first occurrence
          setIdOccurrences((prev) => {
            const newMap = new Map(prev)
            newMap.set(`${id}#0`, { count: 1 })
            return newMap
          })
        } else {
          // add new occurrence
          // but only update count on the first occurrence
          setIdOccurrences((prev) => {
            const count = idOccurrences.get(`${id}#0`)?.count || 1
            const newMap = new Map(prev)
            newMap.set(`${id}#0`, { count: count + 1 })
            newMap.set(`${id}#${count}`, { count: 1 })
            return newMap
          })
        }
      }
    })
  }, [idList])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setImportString(e.target.innerText)
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    // pasting uncleaned text would mess up editable div
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')

    if (editableDivRef.current) {
      editableDivRef.current.innerText =
        editableDivRef.current.innerText.concat(text)
      editableDivRef.current.dispatchEvent(
        new Event('input', { bubbles: true })
      )
    }
  }

  function handleClose() {
    closeModal()
    setTimeout(() => {
      setIdList([])
    }, 300)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all lg:max-w-4xl">
                <Dialog.Title as="h3" className="mb-5 font-medium">
                  Add more items for bidding
                </Dialog.Title>
                <div className="flex flex-col gap-2">
                  <div className="flex max-h-96 w-full">
                    <div
                      className="textarea textarea-bordered flex-1 overflow-y-auto"
                      contentEditable
                      data-placeholder="Paste here your text containing item IDs."
                      onInput={handleInput}
                      onPaste={handlePaste}
                      ref={editableDivRef}
                    ></div>
                    <div className="divider divider-horizontal"></div>
                    <div className="card min-h-16 grid flex-1 place-items-center gap-1 overflow-y-auto rounded-sm px-2">
                      {idList.map((itemId) => (
                        <ImportableItem id={itemId} />
                      ))}
                    </div>
                  </div>
                  <div className="flex place-items-center justify-end gap-6">
                    {idList.length > 1 &&
                      `Detected ${idList.length} items of ${uniqueIds.length} types`}
                    <button className="btn btn-primary">Add</button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
