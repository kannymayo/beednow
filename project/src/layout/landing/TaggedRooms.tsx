import clsx from 'clsx'
import { useState } from 'react'

import useUserAtom from '@/store/useUserAtom'
import { useQueryGetTaggedRooms } from '@/api/room'
import RoomCard from './room-preview/RoomCard'

export default function TaggedRooms() {
  const [user] = useUserAtom()
  const [hostedRooms, joinedRooms] = useQueryGetTaggedRooms()

  const [activeTab, setActiveTab] = useState('hosted')
  const displayedRooms = activeTab === 'hosted' ? hostedRooms : joinedRooms
  // should remove hostedRooms from joinedRooms

  const tabHostedCls = clsx(
    { 'tab-active': activeTab === 'hosted' },
    'tab flex-1 tab-bordered'
  )
  const tabJoinedCls = clsx(
    { 'tab-active': activeTab === 'joined' },
    'tab flex-1 tab-bordered'
  )
  const tabRoomsCategories = (
    <div className="tabs  flex">
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

        <ul className="grid-row grid grid-cols-2 gap-2 overflow-y-auto">
          {displayedRooms?.data?.map((room) => (
            <RoomCard details={room as any} key={room.id} />
          ))}
        </ul>
      </div>
    </section>
  )

  function handleTabClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const tab = e.currentTarget.textContent?.toLowerCase()
    if (tab) setActiveTab(tab.toLowerCase())
  }
}
