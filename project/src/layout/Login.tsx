import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

import { ReactComponent as GoogleIcon } from '../assets/google-icon.svg'
import { ReactComponent as Logo } from '../assets/logo.svg'
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
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false)
  const refEmailSignInBtn = React.useRef<HTMLButtonElement>(null)
  const refGoogleSignInBtn = React.useRef<HTMLAnchorElement>(null)

  const loginBanner = (
    <>
      <Logo className="h-7 w-auto sm:h-8" />
      <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 sm:text-3xl">
        sign In
      </h1>
    </>
  )

  const emailField = (
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
  )

  const passwordField = (
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
  )

  const emailSignInBtnCls = clsx(
    { loading: isSubmitDisabled },
    'btn w-full rounded-lg border-0 bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50'
  )
  const emailSignInBtn = (
    <button ref={refEmailSignInBtn} className={emailSignInBtnCls}>
      Sign in
    </button>
  )

  const dividerForAlternative = (
    <>
      <div className="divider"></div>
      <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
        or sign in with
      </p>
    </>
  )

  const signInWithGoogleBtnCls =
    'btn disabled:loading btn-outline mt-4 flex transform cursor-pointer items-center justify-center rounded-lg border-2 border-slate-300 px-6 py-3 capitalize transition-colors duration-300 hover:border-slate-400 hover:bg-slate-200 hover:text-gray-600'
  const signInWithGoogleBtn = (
    <a
      ref={refGoogleSignInBtn}
      onClick={handleGoogleSignIn}
      className={signInWithGoogleBtnCls}
    >
      <GoogleIcon />
      <span className="mx-2 text-slate-700 ">Google</span>
    </a>
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
    <section className="col-span-13 row-span-12 bg-slate-50 dark:bg-gray-900">
      <div className="container mx-auto flex h-full items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
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
      </div>
    </section>
  )
  return _RETURN

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    setIsSubmitDisabled(true)
    refEmailSignInBtn.current?.setAttribute('disabled', 'disabled')
    refGoogleSignInBtn.current?.setAttribute('disabled', 'disabled')

    // wait at least 1.5s
    // also react-firebase-hooks won't throw
    await Promise.all([
      signInWithEmail(username as string, password as string),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
    setIsSubmitDisabled(false)
    refEmailSignInBtn.current?.removeAttribute('disabled')
    refGoogleSignInBtn.current?.removeAttribute('disabled')
  }

  async function handleGoogleSignIn() {
    setIsSubmitDisabled(true)
    refEmailSignInBtn.current?.setAttribute('disabled', 'disabled')
    refGoogleSignInBtn.current?.setAttribute('disabled', 'disabled')

    await Promise.all([
      signInWithGoogle(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
    setIsSubmitDisabled(false)
    refEmailSignInBtn.current?.removeAttribute('disabled')
    refGoogleSignInBtn.current?.removeAttribute('disabled')
  }
}
