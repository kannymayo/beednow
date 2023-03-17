import { useEffect } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'

import { Room, useQueryCurrentRoom } from '@/api/room'
import { firebaseAtomFamily } from './helper/firebase-atom-family'
import createAtomHooks from './helper/create-atom-hooks'

const roomAtom = atom<Room | null>(null)
const roomIdAtom = atom<string>('')
const roomPreviewAtom = atom<Room | null>(null)

const isRoomHostAtom = atom<boolean>(false)
isRoomHostAtom.onMount = (setAtom) => {
  return () => setAtom(false)
}

const useRoomPreviewAtoms = createAtomHooks(roomPreviewAtom, {
  setFn: ({ resetOnUnmount = false }: { resetOnUnmount?: boolean } = {}) => {
    const setRoomPreview = useSetAtom(roomPreviewAtom)
    useEffect(() => {
      if (resetOnUnmount) {
        return () => {
          setRoomPreview(null)
        }
      }
    }, [])

    return setRoomPreview
  },
})

const useRoomIdAtoms = createAtomHooks(roomIdAtom, {
  setFn: ({ resetOnUnmount = false }: { resetOnUnmount?: boolean } = {}) => {
    const setRoomId = useSetAtom(roomIdAtom)
    useEffect(() => {
      if (resetOnUnmount) {
        return () => {
          setRoomId('')
        }
      }
    }, [])

    return setRoomId
  },
})

const useRoomAtoms = createAtomHooks(roomAtom, {
  setFn: ({ isMaster = false }: { isMaster?: boolean }) => {
    const [{ data: room }] = useQueryCurrentRoom()
    const setRoom = useSetAtom(roomAtom)

    useEffect(() => {
      if (room) {
        setRoom(room)
      }
      if (isMaster) {
        return () => {
          setRoom(null)
        }
      }
    }, [room?.id, (room?.chats as any)?.length])
    return setRoom
  },
})

const readonlyChatsAtom = atom((get) => get(roomAtom)?.chats)
const useChatAtoms = createAtomHooks(readonlyChatsAtom)

function useAsyncAtomRoom({
  roomId,
  isSubscribed = false,
}: {
  roomId: string
  isSubscribed?: boolean
}) {
  const statusAtom = firebaseAtomFamily({
    segments: ['rooms', roomId],
    isSubscribed,
  })
  return {
    getter: useAtomValue<Room>(statusAtom),
  }
}

function useAtomIsRoomHost() {
  return {
    getter: useAtomValue(isRoomHostAtom),
    setter: useSetAtom(isRoomHostAtom),
    tuple: [useAtomValue(isRoomHostAtom), useSetAtom(isRoomHostAtom)] as const,
  }
}

export {
  useRoomIdAtoms,
  useAsyncAtomRoom,
  useAtomIsRoomHost,
  useRoomPreviewAtoms,
  useChatAtoms,
  useRoomAtoms,
}
