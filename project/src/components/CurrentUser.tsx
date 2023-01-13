import React from 'react'

export default function CurrentUser() {
  const isLoggedIn = true

  const unloggedInView = <>Login</>
  const loggedInView = <>User</>

  return isLoggedIn ? loggedInView : unloggedInView
}
