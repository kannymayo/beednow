import { useEffect } from 'react'
import { atom, useSetAtom } from 'jotai'

import { Room, useQueryCurrentRoom } from '@/api/room'
import createAtomHooks from './helper/create-atom-hooks'

const roomAtom = atom<Room | null>(null)
const roomIdAtom = atom<string>('')
const roomPreviewAtom = atom<Room | null>(null)
const isRoomHostAtom = atom<boolean>(false)

const useIsRoomHostAtoms = createAtomHooks(isRoomHostAtom, {
  setFn: ({ resetOnUnmount = false } = {}) => {
    const setIsRoomHost = useSetAtom(isRoomHostAtom)

    useEffect(() => {
      if (resetOnUnmount) {
        return () => {
          setIsRoomHost(false)
        }
      }
    }, [])

    return setIsRoomHost
  },
})

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

export {
  useRoomIdAtoms,
  useRoomPreviewAtoms,
  useIsRoomHostAtoms,
  useChatAtoms,
  useRoomAtoms,
}
