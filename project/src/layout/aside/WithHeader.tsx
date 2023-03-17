import { useEffect, Suspense } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { Loader } from '@mantine/core'

import { useQueryCurrentRoom } from '@/api/room'
import { useUserAtoms } from '@/store/useUserAtom'
import { useAtomIsRoomHost, useAtomRoomId } from '@/store/useRoomAtom'
import Header from './header/Header'

export default function WithHeader() {
  // update title for better bookmarking
  const [queryCurrentRoom] = useQueryCurrentRoom()
  const roomInfo = queryCurrentRoom.data
  useUpdateTitle(roomInfo?.name || '')

  // sync isRoomHost to Atom
  const [[user]] = useUserAtoms().getset()
  const setIsRoomHost = useAtomIsRoomHost().setter()
  useEffect(() => {
    if (!user.uid || !roomInfo?.hostedBy) return setIsRoomHost(false)
    setIsRoomHost(user.uid === roomInfo?.hostedBy)
  }, [roomInfo?.hostedBy, user.uid])

  // sync roomIdd in url to Atom
  const param = useParams()
  const setRoomId = useAtomRoomId().setter()
  useEffect(() => {
    setRoomId(param.roomId || '')
    return () => {
      setRoomId('')
    }
  }, [param])

  return (
    <div className="grid-rows-2-header-body grid h-full min-h-[500px] w-full min-w-[768px]">
      <Header />
      <Suspense fallback={<Loader className="mx-auto mt-[40vh]" size={60} />}>
        <Outlet />
      </Suspense>
    </div>
  )

  function useUpdateTitle(title: string) {
    useEffect(() => {
      if (title) document.title = `BeedNow: ${title}` || 'BeedNow'
    }, [title])
  }
}
