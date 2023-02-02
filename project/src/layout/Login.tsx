import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

import { errorToast } from '../utils/preset-toast'
import { ReactComponent as GoogleIcon } from '../assets/google-icon.svg'
import { ReactComponent as Logo } from '../assets/logo.svg'
import { useAuthContext } from '../store/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { googleSignIn, signInWithEmail } = useAuthContext()
  const loginRedir = location.state?.loginRedir || '/'
  const redirMsg = loginRedir === '/' ? '' : `Redirecting to ${loginRedir}`

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
    ;(async () => {
      try {
        const cred = await signInWithEmail(username, password)
        toast(
          `Logged in as ${cred.user.email}.${
            redirMsg !== '' ? '' : ' ' + redirMsg
          }`,
          {
            type: 'success',
          }
        )
        navigate(loginRedir, { replace: true })
      } catch (e) {
        errorToast('Login ', e as Error, 'code')
      }
    })()
  }

  return (
    <section className="col-span-13 row-span-12 bg-slate-50 dark:bg-gray-900">
      <div className="container mx-auto flex h-full items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <Logo className="h-7 w-auto sm:h-8" />
          <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 sm:text-3xl">
            sign In
          </h1>

          <div className="relative mt-8 flex items-center">
            <EnvelopeIcon className="absolute mx-2 h-6 w-6" />
            <input
              name="username"
              type="email"
              placeholder="Email address"
              required
              className="block w-full rounded-lg border bg-white py-3 px-11 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div className="relative mt-4 flex items-center">
            <LockClosedIcon className="absolute mx-2 h-6 w-6" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div className="mt-6">
            <button className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Sign in
            </button>
            <div className="divider"></div>
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
              or sign in with
            </p>
            <a
              onClick={googleSignIn}
              className="mt-4 flex transform cursor-pointer items-center justify-center rounded-lg border px-6 py-3 text-gray-600 transition-colors duration-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <GoogleIcon />
              <span className="mx-2">Google</span>
            </a>
            <div className="mt-6 text-center ">
              <Link
                to="/register"
                state={{ loginRedir }}
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                Don’t have an account yet? Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
