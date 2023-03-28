import clsx from 'clsx'
import { useState, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useUserAtoms } from '@/store/useUserAtom'
import { useQueryRoomActivities } from '@/api/room'
import { Loader } from '@mantine/core'
import RoomListItem from './room-preview/RoomListItem'

export default function MyRooms() {
  const [user] = useUserAtoms().get()
  const [activeTab, setActiveTab] = useState('hosted')
  const [roomActivities] = useQueryRoomActivities({
    enabled: !!user?.uid,
    subscribe: true,
  })

  const activitiesJoin = roomActivities.data?.filter(
    (activity) => activity?.type === 'joined'
  )
  const activitiesHost = roomActivities.data?.filter(
    (activity) => activity?.type === 'hosted'
  )
  const displayedActivities =
    activeTab === 'hosted' ? activitiesHost : activitiesJoin

  const tabHostedCls = clsx(
    { 'tab-active': activeTab === 'hosted' },
    'tab flex-1 tab-bordered'
  )
  const tabJoinedCls = clsx(
    { 'tab-active': activeTab === 'joined' },
    'tab flex-1 tab-bordered'
  )
  const tabRoomsCategories = (
    <div className="tabs flex">
      <a onClick={handleTabClick} className={tabHostedCls}>
        Hosted
      </a>
      <a onClick={handleTabClick} className={tabJoinedCls}>
        Joined
      </a>
    </div>
  )

  return (
    <section className="flex flex-1">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-6">
        <h1 className="mt-3 w-fit text-2xl font-semibold capitalize text-slate-900 sm:text-3xl">
          My rooms
        </h1>
        {tabRoomsCategories}

        <div className="flex-1">
          <ErrorBoundary fallback={<></>} resetKeys={[activeTab]}>
            <Suspense fallback={<Loader className="mx-auto mt-4" />}>
              <ul className="overflow-y-auto">
                {displayedActivities?.map((RoomActivity) => (
                  <RoomListItem
                    key={RoomActivity.id}
                    roomId={RoomActivity.id}
                  />
                ))}
              </ul>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  )

  function handleTabClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const tab = e.currentTarget.textContent?.toLowerCase()
    if (tab) setActiveTab(tab.toLowerCase())
  }
}
