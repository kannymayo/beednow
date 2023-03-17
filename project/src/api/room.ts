import { FieldValue, serverTimestamp, Timestamp } from 'firebase/firestore'
import { useMutation } from '@tanstack/react-query'

import { useUserAtoms } from '@/store/useUserAtom'
import { useAtomRoomId } from '@/store/useRoomAtom'
import { useQueryFirebase } from '@/hooks/firebase-react-query-hooks'
import { getRandomName } from '@/utils/random-name'
import {
  upcreateFirebaseDoc,
  upcreateFirebaseDocWithAutoId,
  getFirebaseDoc,
  deleteFirebaseDoc,
} from './helper/firebase-CRUD-throwable'
import { toasto } from '@/utils/toasto'
import { ChatMsg } from './chat'

interface Room {
  biddings?: undefined // collection, not directly queried

  id: string
  name: string
  hostedBy: string
  joinedBy: string[]
  attendees: string[] // realtime
  createdAt: Timestamp
  chats?: ChatMsg[] | FieldValue

  bidOrder?: string[] // array of all bidding ids
}

interface RoomActivity {
  id: string // room id
  type: 'joined' | 'hosted'
  lastModified: Timestamp
}

function useQueryRoomActivities({
  enabled = true,
  subscribe = false,
}: {
  enabled?: boolean
  subscribe?: boolean
}) {
  const [user] = useUserAtoms().get()
  const queryKey = ['users', user?.uid, 'roomActivities']

  const [query] = useQueryFirebase<RoomActivity[]>({
    segments: queryKey,
    isSubscribed: subscribe,
    isEnabled: enabled,
  })

  return [query, queryKey] as const
}

function useCreateRoom() {
  const [user] = useUserAtoms().get()
  const [joinRoom] = useJoinRoom()
  return [create]

  async function create() {
    const roomId = await upcreateFirebaseDocWithAutoId({
      segments: ['rooms'],
      data: {
        name: getRandomName(),
        hostedBy: user.uid,
        createdAt: serverTimestamp(),
      },
    })
    await joinRoom(roomId)
    toasto('Room created.', { type: 'success' })
    return roomId
  }
}

function useJoinRoom() {
  const [user, isLoggedIn] = useUserAtoms().get()
  const [updateRoomAcvitity] = useUpdateRoomAcvitity()
  return [joinRoom]

  async function joinRoom(roomId: string | undefined) {
    // retrieve room info
    if (!isLoggedIn) throw Error('No logged-in user yet.')
    const room = await getFirebaseDoc<Room>({
      segments: ['rooms', roomId],
    })
    if (!room) throw Error('The room does not exist.')

    // add user to room if not already in
    const uid = user.uid as string // undefined causes error earlier
    if (!room?.joinedBy?.includes(uid)) {
      await upcreateFirebaseDoc({
        segments: ['rooms', roomId],
        data: {
          joinedBy: [...(room.joinedBy || []), uid],
        },
      })
    }

    // update user's own record of room activity
    if (room?.hostedBy === uid) {
      return await updateRoomAcvitity(roomId, 'hosted')
    } else {
      return await updateRoomAcvitity(roomId, 'joined')
    }
  }
}

function useMutationDeleteRoom() {
  const [user] = useUserAtoms().get()
  const mutation = useMutation({
    mutationFn: deleteRoom,
    onError: (err) => {
      const error = err as Error
      toasto(error.message, { type: 'error' })
    },
    onSuccess: () => {
      toasto('Room deleted.', { type: 'success' })
    },
  })
  return [mutation]

  async function deleteRoom(roomId: string) {
    // delete room
    await deleteFirebaseDoc({
      segments: ['rooms', roomId],
    })

    // delete user's room activity
    await deleteFirebaseDoc({
      segments: ['users', user.uid, 'roomActivities', roomId],
    })

    // should delete all subcollections manually, like
    // biddings, offers and chats LOL
  }
}

/**
 * TODO: check user ban list
 */
function useUpdateRoomAcvitity() {
  const [user] = useUserAtoms().get()
  return [updateRoomActivity]

  async function updateRoomActivity(
    roomId: string | undefined,
    activityType: RoomActivity['type'] = 'joined'
  ) {
    return upcreateFirebaseDoc({
      segments: ['users', user.uid, 'roomActivities', roomId],
      data: {
        type: activityType,
        lastModified: serverTimestamp(),
      },
    })
  }
}

function useQueryCurrentRoom() {
  const roomId = useAtomRoomId().getter()
  const [query] = useQueryFirebase<Room>({
    segments: ['rooms', roomId],
    isSubscribed: true,
  })
  return [query]
}

function useQueryIsThatHostedbyMe(uidRoomHost?: string) {
  const [user, isLoggedIn] = useUserAtoms().get()
  const [query] = useQueryCurrentRoom()
  const room = query?.data
  // if uidRoomHost is not provided, check if the host of current room
  // is the same as the logged-in user
  if (!uidRoomHost) {
    if (!isLoggedIn || !room) return [false]
    return [room?.hostedBy === user?.uid]
  } else {
    if (!isLoggedIn) return [false]
    return [uidRoomHost === user?.uid]
  }
}

export {
  useCreateRoom,
  useUpdateRoomAcvitity,
  useJoinRoom,
  useMutationDeleteRoom,
  useQueryRoomActivities,
  useQueryCurrentRoom,
}

export type { Room }
