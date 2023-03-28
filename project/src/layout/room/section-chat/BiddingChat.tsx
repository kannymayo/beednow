import { useState, useEffect, useRef } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

import { useMutationSendChat, ChatMsg } from '@/api/chat'
import { useUserAtoms } from '@/store/useUserAtom'
import { useAsyncAtomCurrentChats } from '@/store/useRoomAtom'
import ChatBubble from './ChatBubble'

export default function BidChat() {
  const chats = useAsyncAtomCurrentChats({
    isSubscribed: true,
  }).getter()
  const [mutationSendChat] = useMutationSendChat()
  const [user] = useUserAtoms().get()
  const refScrollingContainer = useRef<HTMLDivElement>(null)
  const [chatMsg, setChatMsg] = useState('')

  useEffect(() => {
    // scroll to bottom
    refScrollingContainer.current?.scrollTo({
      top: 9999999,
      behavior: 'smooth',
    })
  }, [(chats as any)?.length])

  return (
    <div className="grid h-full w-full">
      <div className="relative flex flex-col items-stretch overflow-hidden bg-slate-100 drop-shadow-lg">
        <div
          ref={refScrollingContainer}
          className="subtle-scrollbar flex-1 overflow-y-auto bg-white px-1"
        >
          {(chats as any)?.length > 0
            ? (chats as any)?.map((chat: ChatMsg) => (
                <ChatBubble
                  key={(chat.createdAt as any)?.toMillis()}
                  avatarURL={chat.sentByUserAvatar}
                  displayName={chat.sentByUsername}
                  message={chat.content}
                  timestamp={(chat.createdAt as any)?.toMillis()}
                  isFromSelf={chat.sentByUserId === user?.uid}
                />
              ))
            : null}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex h-10 shrink-0 items-center gap-3 px-2"
        >
          <div className="flex-1">
            <input
              type="text"
              className="h-7 w-full rounded-full border-none p-0 px-2"
              placeholder="Aa"
              onChange={(e) => setChatMsg(e.target.value)}
              value={chatMsg}
            />
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full p-0 transition-all hover:bg-slate-500 hover:text-white active:scale-90">
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutationSendChat.mutate({
      content: chatMsg,
    })
    setChatMsg('')
  }
}
