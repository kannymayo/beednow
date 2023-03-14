import clsx from 'clsx'
export default function ({
  avatarURL,
  displayName,
  message,
  timestamp,
  isFromSelf,
}: {
  avatarURL: string
  displayName: string
  message: string
  timestamp: number
  isFromSelf: boolean
}) {
  const time = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <div
      className={clsx(
        {
          'chat-end': isFromSelf,
          'chat-start': !isFromSelf,
        },
        'chat group'
      )}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full bg-slate-500 hover:brightness-125">
          <img
            style={{
              objectFit: 'contain',
            }}
            referrerPolicy="no-referrer"
            src={avatarURL}
          />
        </div>
      </div>
      <div className="chat-header invisible flex items-end gap-1 group-hover:visible">
        {displayName}
        <time className="text-xs opacity-50">{time}</time>
      </div>
      <div className="chat-bubble mb-1 min-h-0 px-3 py-1">{message}</div>
    </div>
  )
}
