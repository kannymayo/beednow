import { useEffect, Suspense } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { Loader } from '@mantine/core'

import { useAtomRoomIdCurrent } from '@/atoms/room'
import CurrentRoomDataSuspense from './data-suspense/CurrentRoom'
import Header from './header/Header'

export default function WithHeader() {
  // sync roomIdd in url to Atom
  const param = useParams()
  const [roomId, setRoomId] = useAtomRoomIdCurrent().tuple()
  useEffect(() => {
    setRoomId(param.roomId || '')
    return () => {
      setRoomId('')
    }
  }, [param])

  return (
    <div className="grid-rows-2-header-body grid h-full min-h-[500px] w-full min-w-[768px]">
      <Header />
      <CurrentRoomDataSuspense roomId={roomId} />
      <Suspense fallback={<Loader className="mx-auto mt-[40vh]" size={60} />}>
        <Outlet />
      </Suspense>
    </div>
  )
}
