import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { ReactComponent as Logo } from '../assets/logo.svg'
import Login from './Login'

export default function EnterRoom() {
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate()

  const headerSearchRoom = (
    <h1 className="ml-auto mt-3 w-fit text-2xl font-semibold capitalize text-slate-900 sm:text-3xl">
      Join a room
    </h1>
  )

  const formSearchRoom = (
    <div className="mt-8 flex items-center gap-2">
      <input
        type="text"
        placeholder="Room ID"
        className="input input-bordered flex-1 px-11"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <GlobeAltIcon className="absolute mx-2 block h-6 w-6" />

      <button
        className="btn btn-primary rounded-lg font-medium capitalize tracking-wide"
        onClick={findRoom}
      >
        Search
      </button>
    </div>
  )

  return (
    <div className="col-span-13 row-span-12 flex items-stretch justify-center bg-slate-50 px-24 py-24  2xl:px-72">
      {/* Enter Room */}
      <section className="flex-1">
        <div className="mx-auto flex w-full max-w-md flex-col px-6">
          {headerSearchRoom}
          {formSearchRoom}
        </div>
      </section>
      <div className="divider divider-horizontal">
        <Logo className="h-20 w-20" />
      </div>
      {/* Login/Reg/Room linked */}
      <Login />
    </div>
  )

  function findRoom() {
    if (!roomId) return
    navigate(`/room/${roomId}`)
  }
}
