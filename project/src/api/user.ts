import { useMutation } from '@tanstack/react-query'

import { useQueryFirebase } from '@/hooks/firebase-react-query-hooks'
import { upcreateFirebaseDoc } from './helper/firebase-CRUD-throwable'
import { getRandomAvatar } from '@/utils/get-random-avatar'

interface UserProfile {
  avatarURL?: string
  roomActivities?: any
}

function useMutationUpdateAvatar() {
  const mutation = useMutation(updateAvatarFn)
  return [mutation]

  async function updateAvatarFn({
    userId,
    avatarURL,
  }: {
    userId: string
    avatarURL?: string
  }) {
    if (!avatarURL) {
      avatarURL = getRandomAvatar()
    }
    await upcreateFirebaseDoc({
      segments: ['users', userId],
      data: {
        avatarURL,
      },
    })
  }
}

function useQueryUserProfile({
  userId,
  isSubscribed,
  isEnabled = false,
}: {
  userId: string
  isSubscribed: boolean
  isEnabled?: boolean
}) {
  const queryKey = ['users', userId]
  const [query] = useQueryFirebase<UserProfile>({
    segments: queryKey,
    isSubscribed,
    isEnabled,
  })
  return [query, queryKey] as const
}

export { useMutationUpdateAvatar, useQueryUserProfile }
