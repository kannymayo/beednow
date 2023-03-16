import { useEffect, useState, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { ErrorBoundary } from 'react-error-boundary'

import { ReactComponent as Logo } from '@/assets/logo.svg'
import { useCreateRoom } from '@/api/room'
import { useUserAtoms } from '@/store/useUserAtom'
import { useRoomPreviewAtoms, useAsyncAtomRoom } from '@/store/useRoomAtom'
import Login from './landing/Login'
import Register from './landing/Register'
import MyRooms from './landing/RoomsOverview'
import RoomPreview from './landing/RoomPreview'

const RoomDataSuspense = ({
  roomId,
  setRoom,
}: {
  roomId: string
  setRoom: (room: any) => void
}) => {
  const room = useAsyncAtomRoom({
    roomId,
  }).getter

  // won't fire when throws
  useEffect(() => {
    setRoom(room)
  }, [roomId])

  return null
}

export default function EnterRoom() {
  const navigate = useNavigate()
  const [user] = useUserAtoms().get()
  const [createNewRoom] = useCreateRoom()
  const setRoomPreview = useRoomPreviewAtoms().set()
  const [isFadingIn, setIsFadingIn] = useState(false)
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  const [isAtLogin, setIsAtLogin] = useState(true)
  const [inputRoomId, setInputRoomId] = useState('')
  // query room and set it for preview, when search box has a likely room id
  const [potentialRoomId, setPotentialRoomId] = useState('')

  const _RETURN = (
    <div className="flex items-stretch justify-center bg-slate-50 px-24 py-10  2xl:px-72">
      <Suspense>
        <ErrorBoundary fallback={<></>} resetKeys={[potentialRoomId]}>
          <RoomDataSuspense roomId={potentialRoomId} setRoom={setRoomPreview} />
        </ErrorBoundary>
      </Suspense>

      {/* Enter Room */}
      <section className="flex-1 basis-1">
        <div className="mx-auto flex h-full w-full max-w-md flex-col justify-between gap-2 px-6">
          <div className="flex flex-1 flex-col">
            {/* Search Room */}
            <h3 className="mt-3 w-fit text-2xl font-semibold capitalize text-slate-900 sm:text-3xl">
              Join a room
            </h3>
            <div className="mt-6 flex items-center">
              <input
                size={6}
                type="text"
                placeholder="Room ID"
                className="input input-bordered flex-1 border-2 px-10"
                value={inputRoomId}
                onChange={handleChangeRoomId}
              />
              <GlobeAltIcon className="absolute mx-2 block h-6 w-6" />
            </div>
            {/* Room Preview */}
            <div className="my-4 flex-1 rounded-lg border-2 bg-white">
              <RoomPreview />
            </div>
          </div>
          {/* Or Create Room */}
          <div className="flex flex-col justify-end">
            {user?.uid && (
              <>
                <div className="divider">or </div>
                <button
                  onClick={handleCreateRoom}
                  disabled={isBtnDisabled}
                  className="disabled:loading btn btn-primary font-medium capitalize tracking-wide"
                >
                  Create a Room
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="divider divider-horizontal">
        <Logo className="h-20 w-20" />
      </div>

      {/* Login/Reg/Room linked */}
      {user?.uid ? (
        <MyRooms />
      ) : isAtLogin ? (
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
              Don't have an account yet? Sign up
            </a>
          </div>
        </Login>
      ) : (
        <Register
          isBtnDisabled={isBtnDisabled}
          toggleIsBtnDisabled={toggleIsBtnDisabled}
          isFadingIn={isFadingIn}
        >
          <div className="mt-6 text-center">
            <a
              onClick={switchLoginReg}
              className="link link-info link-hover text-sm"
            >
              Already have an account? Sign in
            </a>
          </div>
        </Register>
      )}
    </div>
  )

  return _RETURN

  function handleChangeRoomId(e: React.ChangeEvent<HTMLInputElement>) {
    const roomId = (e.target.value || '').trim()
    setInputRoomId(roomId)

    if (roomId.length !== 20) return
    if (!/^[a-zA-Z0-9]{20}$/.test(roomId)) return
    setPotentialRoomId(roomId)
  }

  function switchLoginReg() {
    setIsAtLogin((prev) => !prev)
    setIsFadingIn(true)
    setTimeout(() => setIsFadingIn(false), 750)
  }

  function toggleIsBtnDisabled() {
    setIsBtnDisabled((prev) => !prev)
  }

  async function handleCreateRoom() {
    const roomId = await createNewRoom()
    navigate(`/room/${roomId}`)
  }
}
