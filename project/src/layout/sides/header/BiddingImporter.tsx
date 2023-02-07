import './BiddingImporter.css'
import React, { useState, useEffect, useRef, useMemo, useReducer } from 'react'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import produce from 'immer'
import { useAtom } from 'jotai'

import {
  useItemDetailsMultiple,
  ItemFromAPI,
} from '../../../api/useItemDetails'
import { readGeneralExport } from '../../../utils/read-export'
import allBidsAtom from '@/store/bid-item'

import ImportableItemGroup from './importableItemGroup'

export default function ImportModal() {
  const [isOpen, setIsOpen] = useState(false)
  const refTextarea = useRef<HTMLTextAreaElement>(null)

  const [, setAllBids] = useAtom(allBidsAtom)

  const [itemOccurrencesGrouped, itemOccurrencesGroupedDispatch] = useReducer(
    iocGroupedReducer,
    {}
  )
  const [importString, setImportString] = useState('')
  const idList = readGeneralExport(importString) || []

  const validItemUniqueCount = Object.keys(itemOccurrencesGrouped).length
  // mathmatical smartass
  const validItemCount =
    Object.entries(itemOccurrencesGrouped).flat(2).length - validItemUniqueCount

  // async query
  const itemDetailsQryRslts = useItemDetailsMultiple(idList)
  const itemOccurrences = useMemo(() => {
    const withQuries = annotateWithQueries(
      createSkeleton(idList),
      itemDetailsQryRslts
    )
    const withUserGenerated = annotateWithIOCSGrouped(
      withQuries,
      itemOccurrencesGrouped
    )
    return withUserGenerated
  }, [
    JSON.stringify(itemDetailsQryRslts.map((r) => r.data?.id)),
    JSON.stringify(idList),
  ])

  useEffect(() => {
    itemOccurrencesGroupedDispatch({
      type: 'sync',
      payload: { IOCs: itemOccurrences },
    })
  }, [
    JSON.stringify(Object.keys(itemOccurrences)),
    JSON.stringify(itemDetailsQryRslts.map((r) => r.data?.id)),
  ])

  var modalTitle = (
    <h3 className="text-lg font-bold">
      Add more items for bidding
      <button
        className="btn btn-secondary btn-xs ml-5"
        onClick={handleAddDemoData}
      >
        Add Demo Data
      </button>
    </h3>
  )

  const importTextareaCls = clsx(
    'textarea textarea-bordered scrollbar-hide m-1 flex-1 overflow-y-auto border-2 p-1 outline-0'
  )
  const importTextarea = (
    <textarea
      className={importTextareaCls}
      data-placeholder="Paste here your text containing item IDs."
      onChange={handleTextareaChange}
      ref={refTextarea}
      value={importString}
    ></textarea>
  )

  const importPreviewCls = clsx(
    'card min-h-16 flex-1 place-items-stretch gap-2 overflow-y-auto rounded-sm px-2 py-1'
  )
  const importPreview = (
    <div className={importPreviewCls}>
      {Object.entries(itemOccurrencesGrouped).map((tuple, index) => (
        <ImportableItemGroup
          group={tuple[1] as ItemOccurrence[]}
          id={parseInt(tuple[0])}
          key={tuple[0]}
          dispatch={itemOccurrencesGroupedDispatch}
        />
      ))}
    </div>
  )

  const summaryContainerCls = clsx(
    'flex flex-grow-0 place-items-center justify-end gap-6'
  )
  const importSummaryAndAction = (
    <div className={summaryContainerCls}>
      {idList.length > 1 && (
        <div className="flex place-items-center gap-1">
          Detected
          <div className="badge badge-accent">{validItemCount}</div>
          items of
          <div className="badge badge-accent">{validItemUniqueCount}</div>
          types
        </div>
      )}
      <button className="btn btn-primary btn-sm" onClick={handleImport}>
        Import
      </button>
    </div>
  )

  const modalContainerCls = clsx(
    'modal-box relative flex min-h-[16rem] max-w-xl flex-col gap-4 md:max-w-2xl lg:max-w-4xl'
  )
  const _RETURN = (
    <>
      <input
        type="checkbox"
        id="import-modal"
        className="modal-toggle"
        checked={isOpen}
        onChange={handleModalChange}
      />
      {/* MODEL BACKDROP */}
      <label htmlFor="import-modal" className="modal cursor-pointer">
        {/* MODEL CONTAINER with overwriting ability, so clicking inside won't dismiss?*/}
        <label className={modalContainerCls} htmlFor="">
          {modalTitle}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex max-h-96 w-full flex-1">
              {importTextarea}
              <div className="divider divider-horizontal"></div>
              {importPreview}
            </div>
            {importSummaryAndAction}
          </div>
        </label>
      </label>
    </>
  )

  return _RETURN

  function handleImport() {
    const selectedItems = Object.values(itemOccurrencesGrouped)
      .flat()
      .filter((item) => item.formState.selected)
    setAllBids(
      produce((draft) => {
        draft.unshift(
          ...selectedItems.map((el) => ({
            uuid: crypto.randomUUID(),
            details: el.details,
          }))
        )
      })
    )
    closeModal()
    const msg = `Added ${selectedItems.length} item${
      selectedItems.length > 1 ? 's' : ''
    } to bidding`
    toast(msg, {
      type: 'info',
    })
  }

  function handleModalChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      openModal()
    } else {
      closeModal()
    }
  }

  function closeModal() {
    setIsOpen(false)
    setTimeout(() => setImportString(''), 300)
  }

  function openModal() {
    setIsOpen(true)
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setImportString(e.target.value)
  }

  function handleAddDemoData() {
    const idPool = [
      40273, 40247, 40254, 44577, 40278, 40288, 40627, 40317, 40207, 40065,
      40346, 40636, 40303, 40256, 40258, 40384,
    ]
    const idList = Array.from(
      { length: Math.max(1, Math.floor(Math.random() * 10)) },
      () => idPool[Math.floor(Math.random() * idPool.length)]
    )
    const text = idList.join(' ')
    setImportString((str) => str + text)
  }
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

function annotateWithIOCSGrouped(
  itemOccurrences: ItemOccurrencesMapped,
  iocsGrouped: ItemOccurrencesGrouped
) {
  const targetFlatten = Object.values(iocsGrouped).flat()
  for (const [idSeq, item] of Object.entries(itemOccurrences)) {
    const targetFormState = targetFlatten.find(
      (el) => el._idSeq === idSeq
    )?.formState
    item.formState = {
      // default comes first, so it can be overwritten
      selected: true,
      ...targetFormState,
    }
  }
  return itemOccurrences
}

function annotateWithQueries(
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
  action: IOCGroupedAction
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'sync': {
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
      }
      case 'toggle-single': {
        const id = action.payload.id
        const seq = action.payload.seq
        if (id === undefined || seq === undefined) break
        const occ = draft[id].find((el) => {
          return JSON.parse(el._idSeq)[1] === seq
        })
        if (occ) {
          occ.formState = { selected: !occ.formState?.selected }
        }
        break
      }
      case 'toggle-group': {
        const id = action.payload.id
        if (id === undefined) break
        const isFirstSelected = draft[id][0].formState?.selected
        draft[id].forEach((el) => {
          el.formState = { selected: !isFirstSelected }
        })
        break
      }

      default:
        break
    }
  })
}
export interface IOCGroupedAction {
  type: 'toggle-single' | 'toggle-group' | 'sync'
  payload: {
    id?: number
    seq?: number
    IOCs?: ItemOccurrencesMapped
  }
}
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
  formState?: {
    selected: boolean
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
