import './ImportModal.css'
import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react'

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
  const [itemOccurrences, setItemOccurrences] = useState<{
    [idSeq: string]: { _count: number }
  }>({})
  const [itemDetails, setItemDetails] = useState<Map<number, ItemFromAPI>>(
    new Map()
  )
  const [importString, setImportString] = useState('')
  const editableDivRef = useRef<HTMLDivElement>(null)

  const idListVolatile = useMemo(
    () => readGeneralExport(importString) || [],
    [importString]
  )

  const idList = useMemo(
    () => [...idListVolatile],
    [JSON.stringify(idListVolatile)]
  )

  const uniqueIds = useMemo(
    () => [...new Set(idList)],
    [JSON.stringify(idList)]
  )

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

  // substantiate itemOccurrences
  useEffect(() => {
    setItemOccurrences((prev) => {
      const newItemOccurrences = { ...prev }
      for (const [key, value] of Object.entries(newItemOccurrences)) {
        let id = JSON.parse(key)[0]
        newItemOccurrences[key] = { ...value, ...itemDetails.get(id) }
      }
      return newItemOccurrences
    })
  }, [
    JSON.stringify(Array.from(itemDetails.keys())),
    JSON.stringify(Object.keys(itemOccurrences)),
  ])

  // compute and write occurrences
  useEffect(() => {
    const newIdOccurrences: { [idSeq: string]: { _count: number } } = {}
    idList.forEach((id) => {
      let first = itemOccurrences[JSON.stringify([id, 0])]
      // debugger
      if (first === undefined || first === null) {
        // creat first occurrence
        newIdOccurrences[JSON.stringify([id, 0])] = { _count: 1 }
      } else {
        // set new occurrence, update count at first occurrence
        newIdOccurrences[JSON.stringify([id, 0])] = { _count: first._count + 1 }
        newIdOccurrences[JSON.stringify([id, first._count])] = { _count: 1 }
      }
    })
    setItemOccurrences(newIdOccurrences)
  }, [JSON.stringify(idList)])

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
      setImportString('')
    }, 300)
  }

  function handleAddDemoData() {
    if (editableDivRef.current !== null) {
      editableDivRef.current.innerText += `[
        //   40273, 40247, 40254, 44577, 40278, 40288, 40627, 40317, 40207, 40065, 40346,
        //   40636, 40303, 40256, 40258, 40384,
        // ]`
      editableDivRef.current.dispatchEvent(
        new Event('input', { bubbles: true })
      )
    }
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
                  <button
                    className="btn btn-secondary btn-xs ml-5"
                    onClick={handleAddDemoData}
                  >
                    Add Demo Data
                  </button>
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
                      {Object.entries(itemOccurrences).map((el) => (
                        <ImportableItem id={JSON.parse(el[0])[0]} key={el[0]} />
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
