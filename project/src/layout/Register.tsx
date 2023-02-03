import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { ReactComponent as Logo } from '../assets/logo.svg'
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from '../hooks/useUnifiedAuth'
import useRedirectOnValidUser from '../hooks/useRedirectOnValidUser'

export default function RegistrationPge() {
  const [createEmailAccount] = useCreateUserWithEmailAndPassword()
  const [user] = useAuthState()
  const redirUrl = useRedirectOnValidUser(user)
  const [animationParent] = useAutoAnimate()

  const [validationMsg, setValidationMsg] = React.useState('')
  const [isDismissed, setIsDismissed] = React.useState(true)

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
          <ul ref={animationParent}>
            <ClientValidationAlert
              isOpen={!isDismissed}
              onClick={() => setIsDismissed(true)}
            >
              {validationMsg}
            </ClientValidationAlert>
          </ul>

          <div className="mt-6">
            <button className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Sign up
            </button>

            <div className="mt-6 text-center ">
              <Link
                to="/login"
                state={{ redirUrl }}
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsDismissed(true)

    const formData = new FormData(event.currentTarget)
    const clientValidationMsg = clientValidate(formData)
    if (clientValidationMsg) {
      setValidationMsg(clientValidationMsg)
      setIsDismissed(false)
      return
    }
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    createEmailAccount(username, password)
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
  if (isOpen) {
    return (
      <div
        onClick={onClick}
        className="alert alert-error mt-4 flex cursor-pointer shadow-lg"
      >
        <div>
          <XCircleIcon className="h-6 w-6 flex-shrink-0 stroke-current" />
          <span>{children}</span>
        </div>
      </div>
    )
  }
  return <></>
}
