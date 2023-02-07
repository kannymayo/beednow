import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const roomIdAtom = atomWithStorage<string>('roomId', '')

function useRoomIdAtom() {
  const [roomId, setRoomId] = useAtom(roomIdAtom)
  return [roomId, setRoomId] as const
}

export { useRoomIdAtom }
