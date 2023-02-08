import {
  collection,
  serverTimestamp,
  getDocs,
  addDoc,
} from 'firebase/firestore'
import { useQueryClient, useQuery } from 'react-query'
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
  return query
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
