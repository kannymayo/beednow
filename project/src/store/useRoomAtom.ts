import { useEffect } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'

import { Room, useQueryCurrentRoom } from '@/api/room'
import { firebaseAtomFamily } from './helper/firebase-atom-family'
import createAtomHooks from './helper/create-atom-hooks'

const roomAtom = atom<Room | null>(null)

const roomPreviewAtom = atom<Room | null>(null)
roomPreviewAtom.onMount = (setAtom) => {
  return () => setAtom(null)
}

const roomIdAtom = atom<string>('')
roomIdAtom.onMount = (setAtom) => {
  return () => setAtom('')
}

const isRoomHostAtom = atom<boolean>(false)
isRoomHostAtom.onMount = (setAtom) => {
  return () => setAtom(false)
}

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

function useAtomRoomId() {
  return {
    getter: useAtomValue(roomIdAtom),
    setter: useSetAtom(roomIdAtom),
    tuple: [useAtomValue(roomIdAtom), useSetAtom(roomIdAtom)] as const,
  }
}

function useAtomRoomPreview() {
  return {
    getter: useAtomValue(roomPreviewAtom),
    setter: useSetAtom(roomPreviewAtom),
    tuple: [
      useAtomValue(roomPreviewAtom),
      useSetAtom(roomPreviewAtom),
    ] as const,
  }
}

export {
  useAsyncAtomRoom,
  useAtomIsRoomHost,
  useAtomRoomId,
  useAtomRoomPreview,
  useChatAtoms,
  useRoomAtoms,
}
