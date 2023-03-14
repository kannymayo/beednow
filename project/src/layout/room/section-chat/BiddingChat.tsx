import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import ChatBubble from './ChatBubble'

export default function BidChat() {
  return (
    <div className="grid h-full w-full">
      <div className="relative flex flex-col items-stretch bg-slate-100 drop-shadow-lg">
        <div className="flex-1 bg-white px-1">
          <ChatBubble
            avatarURL="https://lh3.googleusercontent.com/a/AEdFTp76FvPqkadoUAQw1MS0YaPc2lQ5uTcQfNp3uM8sLw=s96-c"
            displayName="Obi-Wan Kenobi"
            message="You were the Chosen One!"
            timestamp={new Date().getTime()}
            isFromSelf={false}
          />
        </div>
        <div className="flex h-10 shrink-0 items-center gap-3 px-2">
          <div className="flex-1">
            <input
              type="text"
              className="h-7 w-full rounded-full border-none p-0 px-2"
              placeholder="Aa"
            />
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full p-0 transition-all hover:bg-slate-500 hover:text-white active:scale-90">
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
