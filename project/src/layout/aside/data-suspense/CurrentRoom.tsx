import { useEffect, Suspense, useTransition, useState } from 'react'

import { useAsyncAtomRoom } from '@/store/useRoomAtom'
import { useUserAtoms } from '@/store/useUserAtom'
import { useAtomIsRoomHost } from '@/store/useRoomAtom'

/**
 * "Data Suspense" is a suspense that is purely used for data manipulation,
 * and renders nothing.
 *
 * Data suspense can be used for notification, but it is really bad for
 * synchronization coz useEffect won't be reached if it suspends
 *
 * This particular one serves as a good example of why data suspense is
 * not a bad fit for data synchronization.
 * Data synchronization requires a useEffect-like mental model, but real
 * useEffect won't be reached if it suspends.
 * Therefore I can only hack it by wrapping it in a transition and use the
 * isPending state to determine if the data is ready or not.
 */
export default function CurrentRoomDataSuspense({
  roomId,
}: {
  roomId: string
}) {
  // tons of rerendering when roomId is not changing
  const [isPending, startTransition] = useTransition()
  const [idTransitioned, setIdTransitioned] = useState(roomId)
  useEffect(() => {
    startTransition(() => {
      setIdTransitioned(roomId)
    })
  }, [roomId, idTransitioned])

  return (
    <Suspense fallback={null}>
      <CurrentRoomData roomId={idTransitioned} isPending={isPending} />
    </Suspense>
  )
}

function CurrentRoomData({
  roomId,
  isPending,
}: {
  roomId: string
  isPending: boolean
}) {
  const currentRoom = useAsyncAtomRoom({
    roomId,
  }).getter()
  const [user, isLoggedIn] = useUserAtoms().get()
  const setIsRoomHost = useAtomIsRoomHost().setter()

  // update title for better bookmarking
  useEffect(() => {
    const title = currentRoom?.name
    if (title) document.title = `BeedNow: ${title}`
    else document.title = 'BeedNow'
  }, [currentRoom?.name])

  // sync isRoomHost to Atom
  useEffect(() => {
    // Q: why reachable when isPending is true? By right useEffect won't fire
    // if the component suspends (in this case, it suspends in a transition)
    if (!isLoggedIn || !currentRoom?.hostedBy) {
      setIsRoomHost(false)
      return
    }
    if (isPending) {
      // if component suspends due to unresolved data, set isRoomHost to false
      // if flashing is a problem, use deferredValue?
      setIsRoomHost(false)
    } else {
      setIsRoomHost(user.uid === currentRoom?.hostedBy)
    }
  })

  return null
}
