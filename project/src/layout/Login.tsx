import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

import { ReactComponent as GoogleIcon } from '../assets/google-icon.svg'

import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from '../hooks/useToastyAuth'
import { useRedirectOnValidUser } from '../hooks/navigateUX'
import useUserAtom from '../store/useUserAtom'

export default function LoginPage() {
  const [user] = useUserAtom()
  const [signInWithEmail] = useSignInWithEmailAndPassword()
  const [signInWithGoogle] = useSignInWithGoogle()

  const redirUrl = useRedirectOnValidUser(user)
  const [isBtnDisabled, setIsSubmitDisabled] = useState(false)

  const loginBanner = (
    <h1 className="mt-3 text-2xl font-semibold capitalize text-slate-900 sm:text-3xl">
      sign In
    </h1>
  )

  const emailField = (
    <div className="relative mt-8 flex items-center">
      <EnvelopeIcon className="absolute mx-2 h-6 w-6" />
      <input
        name="username"
        type="email"
        placeholder="Email address"
        required
        className=" input input-bordered w-full px-10"
      />
    </div>
  )

  const passwordField = (
    <div className="relative mt-4 flex items-center">
      <LockClosedIcon className="absolute mx-2 h-6 w-6" />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="input input-bordered w-full px-10"
      />
    </div>
  )

  const emailSignInBtnCls = clsx(
    'disabled:loading btn w-full rounded-lg border-0 btn-primary px-6 py-3 text-sm font-medium capitalize tracking-wide'
  )
  const emailSignInBtn = (
    <button className={emailSignInBtnCls} disabled={isBtnDisabled}>
      Sign in
    </button>
  )

  const dividerForAlternative = (
    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
      or sign in with
    </p>
  )

  const signInWithGoogleBtnCls =
    'btn disabled:loading btn-outline mt-4 flex items-center justify-center rounded-lg border-2 border-slate-300 px-6 py-3 capitalize transition-colors duration-300 hover:border-slate-400 hover:bg-slate-200 hover:text-gray-600 w-full'
  const signInWithGoogleBtn = (
    <button
      onClick={handleGoogleSignIn}
      className={signInWithGoogleBtnCls}
      disabled={isBtnDisabled}
    >
      <GoogleIcon />
      <span className="mx-2 text-slate-700 ">Google</span>
    </button>
  )

  const registerLink = (
    <div className="mt-6 text-center ">
      <Link
        to="/register"
        state={{ redirUrl }}
        className="text-sm text-blue-500 hover:underline dark:text-blue-400"
      >
        Don’t have an account yet? Sign up
      </Link>
    </div>
  )

  const _RETURN = (
    <section className="col-span-13 row-span-12 flex-1 bg-slate-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex h-full max-w-md flex-col items-stretch justify-start px-6"
      >
        {loginBanner}
        {emailField}
        {passwordField}
        <div className="mt-6">
          {emailSignInBtn}
          {dividerForAlternative}
          {signInWithGoogleBtn}
          {registerLink}
        </div>
      </form>
    </section>
  )
  return _RETURN

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    setIsSubmitDisabled(true)

    // wait at least 1.5s
    // also react-firebase-hooks won't throw
    await Promise.all([
      signInWithEmail(username as string, password as string),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
    setIsSubmitDisabled(false)
  }

  async function handleGoogleSignIn() {
    setIsSubmitDisabled(true)

    await Promise.all([
      signInWithGoogle(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
    setIsSubmitDisabled(false)
  }
}
