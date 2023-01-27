import './ImportModal.css'
import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useMemo,
  useReducer,
} from 'react'
import produce from 'immer'

import { useItemDetailsMultiple, ItemFromAPI } from '../../../api/itemDetails'
import { readGeneralExport } from '../../../utils/read-export'

import { Dialog, Transition } from '@headlessui/react'
import ImportableItemGroup from './importableItemGroup'

interface CommonFields {
  _count: number
  details?: ItemFromAPI
  qry?: {
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
  }
  _processingFlags?: {
    isMatchError?: boolean
  }
}

interface ItemOccurrencesMapped {
  [idSeq: string]: CommonFields
}

export interface ItemOccurrence extends CommonFields {
  _idSeq: string
}

export interface ItemOccurrencesGrouped {
  [id: number]: ItemOccurrence[]
}

export default function ImportModal({
  isOpen = false,
  closeModal,
}: {
  isOpen: boolean
  closeModal: () => void
}) {
  const [itemOccurrencesGrouped, itemOccurrencesGroupedDispatcher] = useReducer(
    iocGroupedReducer,
    {}
  )
  const [importString, setImportString] = useState('')
  const editableDivRef = useRef<HTMLDivElement>(null)

  const idList = useMemo(
    () => readGeneralExport(importString) || [],
    [importString]
  )

  const uniqueIds = useMemo(
    () => [...new Set(idList)],
    [JSON.stringify(idList)]
  )

  const validItemUniqueCount = Object.keys(itemOccurrencesGrouped).length
  // mathmatical smart
  const validItemCount =
    Object.entries(itemOccurrencesGrouped).flat(2).length - validItemUniqueCount

  const itemDetailsQryRslts = useItemDetailsMultiple(idList)

  const itemOccurrences = useMemo(() => {
    return annotate(createSkeleton(idList), itemDetailsQryRslts)
  }, [
    JSON.stringify(itemDetailsQryRslts.map((r) => r.data?.id)),
    JSON.stringify(uniqueIds),
  ])

  useEffect(() => {
    itemOccurrencesGroupedDispatcher({
      type: 'sync',
      payload: { IOCs: itemOccurrences },
    })
  }, [
    JSON.stringify(Object.keys(itemOccurrences)),
    JSON.stringify(itemDetailsQryRslts.map((r) => r.data?.id)),
  ])

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
                      {Object.entries(itemOccurrencesGrouped).map(
                        (tuple, index) => (
                          <ImportableItemGroup
                            group={tuple[1] as ItemOccurrence[]}
                            key={tuple[0]}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex place-items-center justify-end gap-6">
                    {idList.length > 1 &&
                      `Detected ${validItemCount} items of ${validItemUniqueCount} types`}
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

function createSkeleton(idList: number[]): ItemOccurrencesMapped {
  const itemOccurrences: { [idSeq: string]: { _count: number } } = {}
  idList.forEach((id) => {
    let first = itemOccurrences[JSON.stringify([id, 0])]
    if (first === undefined || first === null) {
      // creat first occurrence
      itemOccurrences[JSON.stringify([id, 0])] = { _count: 1 }
    } else {
      // set new occurrence, update count at first occurrence
      itemOccurrences[JSON.stringify([id, 0])] = {
        _count: first._count + 1,
      }
      itemOccurrences[JSON.stringify([id, first._count])] = { _count: 1 }
    }
  })
  return itemOccurrences
}

function annotate(
  itemOccurrences: ItemOccurrencesMapped,
  queryResults: ReturnType<typeof useItemDetailsMultiple>
) {
  for (const [idSeq, body] of Object.entries(itemOccurrences)) {
    const id = JSON.parse(idSeq)[0]
    const matchedQuery = queryResults.find((qryRslt) => qryRslt.data?.id === id)
    if (matchedQuery) {
      itemOccurrences[idSeq] = {
        ...body,
        ...(matchedQuery && { details: matchedQuery.data }),
        ...(matchedQuery && {
          qry: {
            isLoading: matchedQuery.isLoading,
            isError: matchedQuery.isError,
            isSuccess: matchedQuery.isSuccess,
          },
        }),
      }
    } else {
      itemOccurrences[idSeq] = {
        ...body,
        _processingFlags: {
          isMatchError: true,
        },
      }
    }
  }
  return itemOccurrences as ItemOccurrencesMapped
}

function iocGroupedReducer(
  state: ItemOccurrencesGrouped,
  action: {
    type: 'toggle-select' | 'togggle-select-all' | 'sync'
    payload: {
      id?: number
      seq?: number
      IOCs?: ItemOccurrencesMapped
    }
  }
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'sync':
        // not taking from the memoized uniqueIds to reduce the number of dependencies
        const IOCs = action.payload.IOCs
        if (!IOCs) break
        const uniqueIds = new Set(
          Object.keys(IOCs).map((idSeq) => JSON.parse(idSeq)[0])
        )
        // remove group whose id is absent in uniqueIds
        for (const id of Object.keys(draft)) {
          if (!uniqueIds.has(id)) {
            delete draft[parseInt(id)]
          }
        }
        Object.entries(IOCs).forEach(([idSeq, IOCValue]) => {
          const id = JSON.parse(idSeq)[0]
          const groupInDraft = draft[id]
          // create 1st member
          if (groupInDraft === undefined || groupInDraft === null) {
            draft[id] = [{ _idSeq: idSeq, ...IOCValue }]
          } else {
            // find member
            const matchedMemberIdx = groupInDraft.findIndex((member) => {
              return member._idSeq === idSeq
            })
            // add member
            if (groupInDraft[matchedMemberIdx] === undefined) {
              groupInDraft.push({ _idSeq: idSeq, ...IOCValue })
            }
            // update member
            else {
              groupInDraft[matchedMemberIdx] = {
                ...groupInDraft[matchedMemberIdx],
                ...IOCValue,
              }
            }
          }
        })

        // remove unmatched groups
        // do this last for processingFlags to overrule
        for (const [id, group] of Object.entries(draft)) {
          if (group.some((member) => member._processingFlags?.isMatchError)) {
            delete draft[parseInt(id)]
          }
        }
        break

      default:
        break
    }
  })
}
