import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'

import { ReactComponent as GoogleIcon } from '../assets/google-icon.svg'
import { ReactComponent as Logo } from '../assets/logo.svg'
import { useAuthContext } from '../store/AuthContext'
import { errorToast } from '../utils/preset-toast'
import clsx from 'clsx'
import { toast } from 'react-toastify'

export default function RegistrationPge() {
  const [validationMsg, setValidationMsg] = React.useState('')
  const [isValid, setIsValid] = React.useState(true)
  const { googleSignIn, user, createEmailAccount } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()
  const loginRedir = location.state?.loginRedir || '/'

  const redirMsg =
    loginRedir === '/'
      ? ''
      : `You will now be redirected to ${loginRedir} afer registration.`

  return (
    <section className="col-span-13 row-span-12 bg-slate-50 dark:bg-gray-900">
      <div className="container mx-auto flex h-full items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <Logo className="h-7 w-auto sm:h-8" />
          <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 sm:text-3xl">
            register
          </h1>

          <div className="relative mt-8 flex items-center">
            <EnvelopeIcon className="absolute mx-2 h-6 w-6" />
            <input
              required
              name="username"
              type="email"
              placeholder="Email address"
              className="block w-full rounded-lg border bg-white py-3 px-11 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div className="relative mt-4 flex items-center">
            <LockClosedIcon className="absolute mx-2 h-6 w-6" />
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div className="relative mt-4 flex items-center">
            <ArrowsRightLeftIcon className="absolute mx-2 h-6 w-6" />
            <input
              required
              name="confirm"
              type="password"
              placeholder="Confirm password"
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <ClientValidationAlert
            isOpen={!isValid}
            onClick={() => setIsValid(true)}
          >
            {validationMsg}
          </ClientValidationAlert>
          <div className="mt-6">
            <button className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Sign up
            </button>

            <div className="mt-6 text-center ">
              <Link
                to="/login"
                state={{ loginRedir }}
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  )

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const clientValidationMsg = clientValidate(formData)
    if (clientValidationMsg) {
      setValidationMsg(clientValidationMsg)
      setIsValid(false)
      return
    }
    const username = formData.get('username')
    const password = formData.get('password')
    ;(async () => {
      try {
        const cred = await createEmailAccount(username, password)
        toast(`Account: ${cred.user.email} is created. ${redirMsg}`, {
          type: 'success',
        })
        navigate(loginRedir, { replace: true })
      } catch (e) {
        errorToast('Registration ', e as Error, 'code')
      }
    })()
  }

  function clientValidate(data: FormData) {
    const password = data.get('password')
    const confirm = data.get('confirm')
    if (password !== confirm) {
      return 'Passwords do not match'
    }
    return null
  }
}

function ClientValidationAlert({
  isOpen,
  onClick,
  children,
}: {
  isOpen: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        { flex: isOpen, hidden: !isOpen },
        'alert alert-error mt-4 cursor-pointer shadow-lg'
      )}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{children}</span>
      </div>
    </div>
  )
}
