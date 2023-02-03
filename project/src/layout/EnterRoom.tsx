import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EnterRoom() {
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate()

  return (
    <div className="col-span-13 row-span-12 bg-slate-50 px-5 py-24">
      <div className="mb-4 flex justify-center">
        <h1 className="title-font mb-4 text-2xl font-medium text-gray-900 sm:text-3xl">
          Join a room
        </h1>
      </div>
      <div className="mx-auto flex items-end justify-center gap-8">
        <div className="form-control relative max-w-xs flex-1 flex-grow">
          <label className="label">
            <span className="label-text">Room ID</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
        <button className="btn btn-primary rounded" onClick={findRoom}>
          Search
        </button>
      </div>
    </div>
  )

  function findRoom() {
    if (!roomId) return
    navigate(`/room/${roomId}`)
  }
}
