import './ImportModal.css'
import React, { useState, useEffect, useRef, useMemo, useReducer } from 'react'
import produce from 'immer'

import { useItemDetailsMultiple, ItemFromAPI } from '../../../api/itemDetails'
import { readGeneralExport } from '../../../utils/read-export'

import ImportableItemGroup from './importableItemGroup'

export default function ImportModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [itemOccurrencesGrouped, itemOccurrencesGroupedDispatch] = useReducer(
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
  // mathmatical smartass
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
    itemOccurrencesGroupedDispatch({
      type: 'sync',
      payload: { IOCs: itemOccurrences },
    })
  }, [
    JSON.stringify(Object.keys(itemOccurrences)),
    JSON.stringify(itemDetailsQryRslts.map((r) => r.data?.id)),
  ])

  var modalTitle = (
    <>
      Add more items for bidding
      <button
        className="btn btn-secondary btn-xs ml-5"
        onClick={handleAddDemoData}
      >
        Add Demo Data
      </button>
    </>
  )

  const importTextarea = (
    <div
      className="textarea textarea-bordered scrollbar-hide m-1 flex-1 overflow-y-auto border-2 p-1 outline-0"
      contentEditable
      data-placeholder="Paste here your text containing item IDs."
      onInput={handleInput}
      onPaste={handlePaste}
      ref={editableDivRef}
    ></div>
  )

  const importPreview = (
    <div className="card min-h-16 flex-1 place-items-stretch gap-2 overflow-y-auto rounded-sm px-2 py-1">
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

  const importSummary = idList.length > 1 && (
    <div className="flex place-items-center gap-1">
      Detected
      <div className="badge badge-accent">{validItemCount}</div>
      items of
      <div className="badge badge-accent">{validItemUniqueCount}</div>
      types
    </div>
  )

  const _RETURN = (
    <>
      <input
        type="checkbox"
        id="import-modal"
        className="modal-toggle"
        checked={isOpen}
        onChange={handleChange}
      />
      {/* MODEL BACKDROP */}
      <label htmlFor="import-modal" className="modal cursor-pointer">
        {/* MODEL CONTAINER with overwriting ability, so clicking inside won't dismiss?*/}
        <label
          className="modal-box relative flex min-h-[16rem] max-w-xl flex-col gap-4 md:max-w-2xl lg:max-w-4xl"
          htmlFor=""
        >
          <h3 className="text-lg font-bold">{modalTitle}</h3>
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex max-h-96 w-full flex-1">
              {importTextarea}
              <div className="divider divider-horizontal"></div>
              {importPreview}
            </div>
            <div className="flex flex-grow-0 place-items-center justify-end gap-6">
              {importSummary}
              <button className="btn btn-primary btn-sm">Import</button>
            </div>
          </div>
        </label>
      </label>
    </>
  )

  return _RETURN

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsOpen(e.target.checked)
    setTimeout(() => setImportString(''), 300)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setImportString(e.target.innerText)
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    // buggy when performing paste at cursor & paste to selection
    // maybe it's still a better option to go with a textarea

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
        // all preselected, unless already specified
        // buggy, but fixing would require the memo to depend on iocsgrouped
        formState: {
          selected: itemOccurrences[idSeq]?.formState?.selected ?? true,
        },
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
