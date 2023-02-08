import { useEffect } from 'react'
import {
  collection,
  serverTimestamp,
  getDocs,
  addDoc,
  onSnapshot,
} from 'firebase/firestore'
import { useQueryClient, useQuery, UseQueryResult } from 'react-query'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { ItemFromAPI } from '@/api/item-details'
import { db } from './firebase'

function useAddItem() {
  const [roomId] = useRoomIdAtom()
  return add

  async function add(item: { details: ItemFromAPI; [any: string]: any }) {
    const ref = collection(db, 'rooms', roomId, 'items')
    await addDoc(ref, {
      ...item,
      createdAt: serverTimestamp(),
    })
  }
}

function useQueryGetItems() {
  const qc = useQueryClient()
  const [roomId] = useRoomIdAtom()
  const query = useQuery(
    ['rooms', roomId, 'items'],
    async () => {
      const ref = collection(db, 'rooms', roomId, 'items')
      const querySnapshot = await getDocs(ref)
      return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    },
    {
      enabled: !!roomId,
    }
  )
  // subscribe to collection changes
  useEffect(() => {
    if (!roomId) return
    const ref = collection(db, 'rooms', roomId, 'items')
    const unsubscribe = onSnapshot(ref, (querySnapshot) => {
      qc.setQueryData(
        ['rooms', roomId, 'items'],
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      )
    })
    return () => unsubscribe()
  }, [])
  return query as UseQueryResult<ItemQueryData[]>
}

interface ItemQueryData {
  id: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  details: ItemFromAPI
}

export { useAddItem, useQueryGetItems }
export type { ItemQueryData }
