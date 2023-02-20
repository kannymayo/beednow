import { useEffect } from 'react'
import { useAtom, atom, useSetAtom, useAtomValue } from 'jotai'

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

function useIsRoomHostAtomValue() {
  return useAtomValue(isRoomHostAtom)
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

function useRoomPreviewSetAtom({
  resetOnUnmount = false,
}: { resetOnUnmount?: boolean } = {}) {
  const setRoomPreview = useSetAtom(roomPreviewAtom)
  useEffect(() => {
    if (resetOnUnmount) {
      return () => {
        setRoomPreview(null)
      }
    }
  }, [])

  return setRoomPreview
}

function useRoomPreviewAtomValue() {
  return useAtomValue(roomPreviewAtom)
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

function useRoomIdSetAtom({
  resetOnUnmount = false,
}: { resetOnUnmount?: boolean } = {}) {
  const setRoomId = useSetAtom(roomIdAtom)
  useEffect(() => {
    if (resetOnUnmount) {
      return () => {
        setRoomId('')
      }
    }
  }, [])

  return setRoomId
}

function useRoomIdAtomValue() {
  return useAtomValue(roomIdAtom)
}

export {
  useRoomIdAtom,
  useRoomIdSetAtom,
  useRoomIdAtomValue,
  useRoomPreviewAtom,
  useRoomPreviewSetAtom,
  useRoomPreviewAtomValue,
  useIsRoomHostAtom,
  useIsRoomHostAtomValue,
}
