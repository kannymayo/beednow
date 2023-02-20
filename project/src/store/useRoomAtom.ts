import { useEffect } from 'react'
import { useAtom, atom } from 'jotai'

import { Room } from '@/api/room'

const roomIdAtom = atom<string>('')
const roomPreviewAtom = atom<Room | null>(null)
const isRoomHostAtom = atom<boolean>(false)

function useIsRoomHostAtom({ resetOnUnmount = false } = {}) {
  const [isRoomHost, setIsRoomHost] = useAtom(isRoomHostAtom)

  useEffect(() => {
    if (resetOnUnmount) {
      return () => {
        setIsRoomHost(false)
      }
    }
  }, [])

  return [isRoomHost, setIsRoomHost] as const
}

function useRoomPreviewAtom({
  resetOnUnmount = false,
}: { resetOnUnmount?: boolean } = {}) {
  const [roomPreview, setRoomPreview] = useAtom(roomPreviewAtom)
  useEffect(() => {
    if (resetOnUnmount) {
      return () => {
        setRoomPreview(null)
      }
    }
  }, [])

  return [roomPreview, setRoomPreview] as const
}

function useRoomIdAtom({
  resetOnUnmount = false,
}: { resetOnUnmount?: boolean } = {}) {
  const [roomId, setRoomId] = useAtom(roomIdAtom)
  useEffect(() => {
    if (resetOnUnmount) {
      return () => {
        setRoomId('')
      }
    }
  }, [])

  return [roomId, setRoomId] as const
}

export { useRoomIdAtom, useRoomPreviewAtom, useIsRoomHostAtom }
