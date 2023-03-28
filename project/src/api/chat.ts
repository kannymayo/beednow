import { FieldValue, arrayUnion, Timestamp } from 'firebase/firestore'
import { useMutation } from '@tanstack/react-query'

import { useUserAtoms } from '@/store/useUserAtom'
import { useAtomRoomIdCurrent } from '@/store/useRoomAtom'
import { upcreateFirebaseDoc } from './helper/firebase-CRUD-throwable'
import { Room } from './room'

/**
 * ChatMsg to Room is like what Offer is to Bidding.
 *
 * Technically it should be a subcollection, but deleting subcollection is a
 * pain in firebase.
 */
interface ChatMsg {
  createdAt: Timestamp | FieldValue | Date
  sentByUsername: string
  sentByUserId: string
  sentByUserAvatar: string
  content: string
}

function useMutationSendChat() {
  const roomId = useAtomRoomIdCurrent().getter()
  const [{ uid, photoURL, displayName: username }] = useUserAtoms().get()
  const mutation = useMutation(async ({ content }: { content: string }) => {
    const chatMsg: ChatMsg = {
      createdAt: new Date(),
      sentByUsername: username || '',
      sentByUserId: uid || '',
      sentByUserAvatar: photoURL || '',
      content,
    }
    await upcreateFirebaseDoc({
      segments: ['rooms', roomId],
      data: {
        chats: arrayUnion(chatMsg),
      } as Partial<Room>,
    })
  })

  return [mutation]
}

export { useMutationSendChat }
export type { ChatMsg }
