import { atom, useSetAtom, useAtomValue } from 'jotai'

import { Room } from '@/api/room'
import { firebaseAtomFamily } from './helper/firebase-atom-family'

// atom definitions
// ----------------
const atomRoomIdPreview = atom<string>('')
const atomRoomPreview = atom<Room | null>(null)
const atomRoomIdCurrent = atom<string>('')
const atomIsRoomHost = atom<boolean>(false)

// atom lifecycles
// ---------------
atomRoomPreview.onMount = (setAtom) => {
  return () => setAtom(null)
}
atomRoomIdCurrent.onMount = (setAtom) => {
  return () => setAtom('')
}
atomIsRoomHost.onMount = (setAtom) => {
  return () => setAtom(false)
}

// useAtom wrappers
// ----------------
function useAtomIsRoomHost() {
  return {
    getter: () => useAtomValue(atomIsRoomHost),
    setter: () => useSetAtom(atomIsRoomHost),
    tuple: () =>
      [useAtomValue(atomIsRoomHost), useSetAtom(atomIsRoomHost)] as const,
  }
}
function useAtomRoomIdCurrent() {
  return {
    getter: () => useAtomValue(atomRoomIdCurrent),
    setter: () => useSetAtom(atomRoomIdCurrent),
    tuple: () =>
      [useAtomValue(atomRoomIdCurrent), useSetAtom(atomRoomIdCurrent)] as const,
  }
}
function useAtomRoomIdPreview() {
  return {
    getter: () => useAtomValue(atomRoomIdPreview),
    setter: () => useSetAtom(atomRoomIdPreview),
    tuple: () =>
      [useAtomValue(atomRoomIdPreview), useSetAtom(atomRoomIdPreview)] as const,
  }
}

// useAsyncAtom wrappers
// ---------------------
function useAsyncAtomCurrentRoom({ isSubscribed = false } = {}) {
  const roomId = useAtomValue(atomRoomIdCurrent)
  // a pity that it is closed over roomId, hence no derived atom
  const asyncAtomCurrentRoom = firebaseAtomFamily({
    segments: ['rooms', roomId],
    isSubscribed,
  })
  return {
    getter: () => useAtomValue<Room>(asyncAtomCurrentRoom),
  }
}

function useAsyncAtomCurrentChats({ isSubscribed = false } = {}) {
  const roomId = useAtomValue(atomRoomIdCurrent)
  const asyncAtomCurrentRoom = firebaseAtomFamily({
    segments: ['rooms', roomId],
    isSubscribed,
  })
  return {
    getter: () => useAtomValue<Room>(asyncAtomCurrentRoom).chats,
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

function useAsyncAtomRoomPreview({
  isSubscribed = false,
}: {
  isSubscribed?: boolean
} = {}) {
  const roomId = useAtomValue(atomRoomIdPreview)
  const statusAtom = firebaseAtomFamily({
    segments: ['rooms', roomId],
    isSubscribed,
  })
  return {
    getter: () => useAtomValue<Room>(statusAtom),
  }
}

export {
  // hooks for wrapped atom
  useAtomIsRoomHost,
  useAtomRoomIdCurrent,
  useAtomRoomIdPreview,
  // hooks for wrapped async atom
  useAsyncAtomRoom,
  useAsyncAtomCurrentRoom,
  useAsyncAtomCurrentChats,
  useAsyncAtomRoomPreview,
}
