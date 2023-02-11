import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAtom, atom } from 'jotai'

const roomIdAtom = atom<string>('')

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

export { useRoomIdAtom, useRoomIdAtomMaster }