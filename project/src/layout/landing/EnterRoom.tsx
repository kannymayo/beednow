import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

import { ReactComponent as Logo } from '@/assets/logo.svg'
import useUserAtom from '@/store/useUserAtom'
import { useCreateRoom } from '@/api/room'
import Login from './Login'
import Register from './Register'
import TaggedRooms from './TaggedRooms'

export default function EnterRoom() {
  const navigate = useNavigate()
  const [user] = useUserAtom()
  const createNewRoom = useCreateRoom()

  const [isFadingIn, setIsFadingIn] = useState(false)
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  const [isAtLogin, setIsAtLogin] = useState(true)
  const [roomId, setRoomId] = useState('')

  const headerSearchRoom = (
    <h1 className="mt-3 w-fit text-2xl font-semibold capitalize text-slate-900 sm:text-3xl">
      Join a room
    </h1>
  )

  const formSearchRoom = (
    <div className="input-group mt-6 flex items-center">
      <input
        size={6}
        type="text"
        placeholder="Room ID"
        className="input input-bordered flex-1 px-10"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <GlobeAltIcon className="absolute mx-2 block h-6 w-6" />

      <button
        disabled={isBtnDisabled}
        className="btn disabled:loading btn-primary rounded-lg font-medium capitalize tracking-wide"
        onClick={findRoom}
      >
        Search
      </button>
    </div>
  )

  const btnCreateRoom = (
    <button
      onClick={handleCreateRoom}
      disabled={isBtnDisabled}
      className="disabled:loading btn btn-primary font-medium capitalize tracking-wide"
    >
      Create a Room
    </button>
  )

  const sectionReg = (
    <Register
      isBtnDisabled={isBtnDisabled}
      toggleIsBtnDisabled={toggleIsBtnDisabled}
      isFadingIn={isFadingIn}
    >
      <div className="mt-6 text-center ">
        <a
          onClick={switchLoginReg}
          className="link link-info link-hover text-sm"
        >
          Already have an account? Sign in
        </a>
      </div>
    </Register>
  )

  const sectionLogin = (
    <Login
      isBtnDisabled={isBtnDisabled}
      toggleIsBtnDisabled={toggleIsBtnDisabled}
      isFadingIn={isFadingIn}
    >
      <div className="mt-6 text-center">
        <a
          onClick={switchLoginReg}
          className="link link-info link-hover text-sm"
        >
          Don’t have an account yet? Sign up
        </a>
      </div>
    </Login>
  )

  const _RETURN = (
    <div className="flex items-stretch justify-center bg-slate-50 px-24 py-24  2xl:px-72">
      {/* Enter Room */}
      <section className="flex-1 basis-1">
        <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-6">
          {headerSearchRoom}
          {formSearchRoom}
          {user?.uid && (
            <>
              <div className=" text-center">or </div>
              {btnCreateRoom}
            </>
          )}
        </div>
      </section>
      <div className="divider divider-horizontal">
        <Logo className="h-20 w-20" />
      </div>
      {/* Login/Reg/Room linked */}
      {user?.uid ? <TaggedRooms /> : isAtLogin ? sectionLogin : sectionReg}
    </div>
  )

  return _RETURN

  function findRoom() {
    if (!roomId) return
    navigate(`/room/${roomId}`)
  }

  function switchLoginReg() {
    setIsAtLogin((prev) => !prev)
    setIsFadingIn(true)
    setTimeout(() => setIsFadingIn(false), 750)
  }

  function toggleIsBtnDisabled() {
    setIsBtnDisabled((prev) => !prev)
  }

  function handleCreateRoom() {
    const roomId = createNewRoom()
    navigate(`/room/${roomId}`)
  }
}
