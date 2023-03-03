import { useState, useEffect, useRef, useMemo, useReducer } from 'react'
import produce from 'immer'

import { useQueryItemDetailsMultiple, ItemFromAPI } from '@/api/item-details'
import { toasto } from '@/utils/toasto'
import { readGeneralExport } from '@/utils/read-export'
import { useAddItem } from '@/api/bidding'
import ModalImporter from './ModalImporter'

interface IOCGroupedAction {
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

interface ItemOccurrence extends CommonFields {
  _idSeq: string
}

type ItemOccurrencesGrouped = Record<string, ItemOccurrence[]>

function ImportModal() {
  const [importString, setImportString] = useState('')
  const [addItem] = useAddItem()
  const refModal = useRef<any>(null)

  const [itemOccurrencesGrouped, itemOccurrencesGroupedDispatch] = useReducer(
    iocGroupedReducer,
    {}
  )

  const idList = readGeneralExport(importString) || []

  // useQueries -> item details
  const itemDetailsQryRslts = useQueryItemDetailsMultiple(idList)
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

  // useQueries -> item details ---\
  //                                >- reduce to state
  // id -> skeleton -> ioc      ---/
  useEffect(() => {
    itemOccurrencesGroupedDispatch({
      type: 'sync',
      payload: { IOCs: itemOccurrences },
    })
  }, [
    JSON.stringify(Object.keys(itemOccurrences)),
    JSON.stringify(itemDetailsQryRslts.map((r) => r.data?.id)),
  ])

  return (
    <ModalImporter
      ref={refModal}
      importString={importString}
      setImportString={setImportString}
      handleAddToRoom={handleAddToRoom}
      handleFillWithDemoData={handleFillWithDemoData}
      iocGrouped={itemOccurrencesGrouped}
      iocGroupedDispatch={itemOccurrencesGroupedDispatch}
    />
  )

  function handleAddToRoom() {
    const selectedItems = Object.values(itemOccurrencesGrouped)
      .flat()
      .filter((item) => item?.formState?.selected)

    // add items for mutation
    selectedItems.forEach((item) => {
      addItem({
        name: item?.details?.name,
        details: item.details as ItemFromAPI,
      })
    })
    // close modal exposed by child
    console.log(refModal.current)
    if (typeof refModal?.current?.closeModal === 'function') {
      refModal.current.closeModal()
    }
    setTimeout(() => setImportString(''), 300)
    const msg = `Added ${selectedItems.length} item${
      selectedItems.length > 1 ? 's' : ''
    } to bidding`
    toasto(msg, {
      type: 'info',
    })
  }

  function handleFillWithDemoData() {
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
  queryResults: ReturnType<typeof useQueryItemDetailsMultiple>
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

export default ImportModal
export type { IOCGroupedAction, ItemOccurrence, ItemOccurrencesGrouped }
