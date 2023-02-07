import { useState } from 'react'
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import clsx from 'clsx'

import useUserAtom from '@/store/useUserAtom'
import { useCreateUserWithEmailAndPassword } from '@/hooks/useToastyAuth'
import { useRedirectOnValidUser } from '@/hooks/navigateUX'

export default function Register({
  children,
  isBtnDisabled,
  toggleIsBtnDisabled,
  isFadingIn,
}: {
  children: React.ReactNode
  isBtnDisabled: boolean
  toggleIsBtnDisabled: () => void
  isFadingIn: boolean
}) {
  const [createEmailAccount] = useCreateUserWithEmailAndPassword()
  const [user] = useUserAtom()
  const redirUrl = useRedirectOnValidUser(user)
  const [animationParent] = useAutoAnimate()

  const [validationMsg, setValidationMsg] = useState('')
  const [isDismissed, setIsDismissed] = useState(true)

  const formHeader = (
    <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 sm:text-3xl">
      register
    </h1>
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
      {children}
    </div>
  )

  const topCls = clsx(
    { 'opacity-50 pointer-events-none': isFadingIn },
    'flex-1 flex-col justify-start'
  )
  const _RETURN = (
    <section className={topCls}>
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md px-6">
        {formHeader}
        {emailField}
        {passwordField}
        {confirmPwdField}
        {animatedValidationMsg}
        {signUpBtnOrRgstr}
      </form>
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

    toggleIsBtnDisabled()

    await Promise.all([
      createEmailAccount(username, password),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
    toggleIsBtnDisabled()
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
        className="alert alert-error mt-4 flex cursor-pointer rounded-lg shadow-lg"
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
