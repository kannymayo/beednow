import { atom, useSetAtom, useAtomValue } from 'jotai'

import { Room } from '@/api/room'
import { firebaseAtomFamily } from './helper/firebase-atom-family'
import createAtomHooks from './helper/create-atom-hooks'

// atom definitions
const roomAtom = atom<Room | null>(null)
const roomPreviewAtom = atom<Room | null>(null)
const roomIdAtom = atom<string>('')
const isRoomHostAtom = atom<boolean>(false)
const readonlyChatsAtom = atom((get) => get(roomAtom)?.chats)
const useChatAtoms = createAtomHooks(readonlyChatsAtom)

// atom lifecycles
roomPreviewAtom.onMount = (setAtom) => {
  return () => setAtom(null)
}
roomIdAtom.onMount = (setAtom) => {
  return () => setAtom('')
}
isRoomHostAtom.onMount = (setAtom) => {
  return () => setAtom(false)
}

function useAsyncAtomCurrentRoom({ isSubscribed = false } = {}) {
  const roomId = useAtomValue(roomIdAtom)
  const asyncAtomCurrentRoom = firebaseAtomFamily({
    segments: ['rooms', roomId],
    isSubscribed,
  })
  return {
    getter: () => useAtomValue<Room>(asyncAtomCurrentRoom),
  }
}

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
    getter: () => useAtomValue<Room>(statusAtom),
  }
}

function useAtomIsRoomHost() {
  return {
    getter: () => useAtomValue(isRoomHostAtom),
    setter: () => useSetAtom(isRoomHostAtom),
    tuple: () =>
      [useAtomValue(isRoomHostAtom), useSetAtom(isRoomHostAtom)] as const,
  }
}

function useAtomRoomId() {
  return {
    getter: () => useAtomValue(roomIdAtom),
    setter: () => useSetAtom(roomIdAtom),
    tuple: () => [useAtomValue(roomIdAtom), useSetAtom(roomIdAtom)] as const,
  }
}

function useAtomRoomPreview() {
  return {
    getter: () => useAtomValue(roomPreviewAtom),
    setter: () => useSetAtom(roomPreviewAtom),
    tuple: () =>
      [useAtomValue(roomPreviewAtom), useSetAtom(roomPreviewAtom)] as const,
  }
}

export {
  useAsyncAtomRoom,
  useAsyncAtomCurrentRoom,
  useAtomIsRoomHost,
  useAtomRoomId,
  useAtomRoomPreview,
  useChatAtoms,
}
