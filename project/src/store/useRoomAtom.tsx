import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAtom, atom } from 'jotai'

import { Room } from '@/api/room'

const roomIdAtom = atom<string>('')
const roomPreviewAtom = atom<Room | null>(null)

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

export { useRoomIdAtom, useRoomPreviewAtom }
