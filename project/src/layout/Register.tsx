import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { ReactComponent as Logo } from '../assets/logo.svg'
import useUserAtom from '../store/useUserAtom'
import { useCreateUserWithEmailAndPassword } from '../hooks/useToastyAuth'
import { useRedirectOnValidUser } from '../hooks/navigateUX'

export default function RegistrationPge() {
  const [createEmailAccount] = useCreateUserWithEmailAndPassword()
  const [user] = useUserAtom()
  const redirUrl = useRedirectOnValidUser(user)
  const [animationParent] = useAutoAnimate()

  const [validationMsg, setValidationMsg] = useState('')
  const [isDismissed, setIsDismissed] = useState(true)
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)

  const formHeader = (
    <>
      <Logo className="h-7 w-auto sm:h-8" />
      <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 sm:text-3xl">
        register
      </h1>
    </>
  )

  const emailField = (
    <div className="relative mt-8 flex items-center">
      <EnvelopeIcon className="absolute mx-2 h-6 w-6" />
      <input
        required
        name="username"
        type="email"
        placeholder="Email address"
        className="input input-bordered w-full px-10"
      />
    </div>
  )

  const passwordField = (
    <div className="relative mt-4 flex items-center">
      <LockClosedIcon className="absolute mx-2 h-6 w-6" />
      <input
        required
        name="password"
        type="password"
        placeholder="Password"
        className="input input-bordered w-full px-10"
      />
    </div>
  )

  const confirmPwdField = (
    <div className="relative mt-4 flex items-center">
      <ArrowsRightLeftIcon className="absolute mx-2 h-6 w-6" />
      <input
        required
        name="confirm"
        type="password"
        placeholder="Confirm password"
        className="input input-bordered w-full px-10"
      />
    </div>
  )

  const animatedValidationMsg = (
    <ul ref={animationParent}>
      <ClientValidationAlert
        isOpen={!isDismissed}
        onClick={() => setIsDismissed(true)}
      >
        {validationMsg}
      </ClientValidationAlert>
    </ul>
  )

  const signUpBtnOrRgstr = (
    <div className="mt-6">
      <button
        disabled={isBtnDisabled}
        className="disabled:loading btn btn-primary   w-full  rounded-lg font-medium capitalize tracking-wide"
      >
        Sign up
      </button>

      <div className="mt-6 text-center ">
        <Link
          to="/"
          state={{ redirUrl }}
          className="text-sm text-blue-500 hover:underline dark:text-blue-400"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  )

  const _RETURN = (
    <section className="col-span-13 row-span-12 bg-slate-50 dark:bg-gray-900">
      <div className="container mx-auto flex h-full items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {formHeader}

          {emailField}
          {passwordField}
          {confirmPwdField}
          {animatedValidationMsg}
          {signUpBtnOrRgstr}
        </form>
      </div>
    </section>
  )
  return _RETURN

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

    setIsBtnDisabled(true)

    await Promise.all([
      createEmailAccount(username, password),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
    setIsBtnDisabled(false)
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
  return null
}
