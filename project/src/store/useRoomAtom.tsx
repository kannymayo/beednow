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

function useRoomIdAtom() {
  const [roomId, setRoomId] = useAtom(roomIdAtom)
  return [roomId, setRoomId] as const
}

// supposed to be a singleton, how to enforce?
function useRoomIdAtomMaster(dynamicSegmentName: string) {
  const param = useParams()
  const [roomId, setRoomId] = useAtom(roomIdAtom)
  useEffect(() => {
    setRoomId(param[dynamicSegmentName] || '')

    return () => {
      setRoomId('')
    }
  }, [])

  return roomId
}

export { useRoomIdAtom, useRoomIdAtomMaster, useRoomPreviewAtom }
