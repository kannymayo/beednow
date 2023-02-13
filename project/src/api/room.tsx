import { serverTimestamp } from 'firebase/firestore'

import useUserAtom from '@/store/useUserAtom'
import { useRoomIdAtom } from '@/store/useRoomAtom'
import { useQueryFirebase } from '@/hooks/firebase-react-query-hooks'
import { getRandomName } from '@/utils/random-name'
import {
  upcreateFirebaseDoc,
  upcreateFirebaseDocWithAutoId,
  getFirebaseDoc,
} from './helper/firebase-CRUD-throwable'

interface FirebaseServerTimestamp {
  seconds: number
  nanoseconds: number
}

interface Room {
  id: string
  name: string
  hostedBy: string
  joinedBy: string[]
  attendees: string[] // realtime
  createdAt: FirebaseServerTimestamp
  biddings?: string // collection
}

interface RoomActivity {
  id: string // room id
  type: 'joined' | 'hosted'
  lastModified: FirebaseServerTimestamp
}

function useQueryGetRoomActivities({
  enabled = true,
  subscribe = false,
}: {
  enabled?: boolean
  subscribe?: boolean
}) {
  const [user] = useUserAtom()
  const queryKey = ['users', user?.uid, 'roomActivities']

  const query = useQueryFirebase<RoomActivity[]>({
    segments: queryKey,
    isSubscribed: subscribe,
    isEnabled: enabled,
  })

  return [query, queryKey] as const
}

function useCreateRoom() {
  const [user] = useUserAtom()
  const [updateRoomActivitiy] = useUpdateRoomAcvitity()
  return create

  async function create() {
    const roomId = await upcreateFirebaseDocWithAutoId({
      segments: ['rooms'],
      data: {
        name: getRandomName(),
        hostedBy: user.uid,
        createdAt: serverTimestamp(),
      },
    })
    await updateRoomActivitiy(roomId, 'hosted')
    return roomId
  }
}

function useJoinRoom() {
  const [user] = useUserAtom()
  const [updateRoomAcvitity] = useUpdateRoomAcvitity()
  return [joinRoom]

  async function joinRoom(roomId: string | undefined) {
    // retrieve room info
    if (!user.uid) throw Error('No logged-in user yet.')
    const room = await getFirebaseDoc<Room>({
      segments: ['rooms', roomId],
    })
    if (!room) throw Error('The room does not exist.')

    // add user to room if not already in
    if (!room?.joinedBy?.includes(user.uid)) {
      await upcreateFirebaseDoc({
        segments: ['rooms', roomId],
        data: {
          joinedBy: [...(room.joinedBy || []), user.uid],
        },
      })
    }

    // update user's own record of room activity
    if (room?.hostedBy === user.uid) {
      return await updateRoomAcvitity(roomId, 'hosted')
    } else {
      return await updateRoomAcvitity(roomId, 'joined')
    }
  }
}

/**
 * TODO: check user ban list
 */
function useUpdateRoomAcvitity() {
  const [user] = useUserAtom()
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

function useQueryGetCurrentRoom() {
  const [roomId] = useRoomIdAtom()
  const query = useQueryFirebase<Room>({
    segments: ['rooms', roomId],
    isSubscribed: true,
  })
  return query
}

function useQueryGetRoom({
  roomId = '',
  isSubscribed = false,
  queryOptions,
}: {
  roomId?: string
  isSubscribed?: boolean
  queryOptions?: Parameters<typeof useQueryFirebase>[0]['queryOptions']
}) {
  const queryKey = ['rooms', roomId]
  const query = useQueryFirebase<Room>({
    segments: queryKey,
    isSubscribed,
    queryOptions,
  })

  return [query, queryKey] as const
}

function useIsSelfHosted() {
  const [user] = useUserAtom()
  const room = useQueryGetCurrentRoom()?.data
  if (!user.uid || !room) return false

  return room?.hostedBy === user?.uid
}

export {
  useCreateRoom,
  useUpdateRoomAcvitity,
  useJoinRoom,
  useIsSelfHosted,
  useQueryGetRoom,
  useQueryGetRoomActivities,
  useQueryGetCurrentRoom,
}

export type { Room }
