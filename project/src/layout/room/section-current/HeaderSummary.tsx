export default function HeaderSummary({
  hasMember,
  name,
  iconUrl,
  itemLevel,
}: {
  hasMember: boolean
  name: string
  iconUrl: string
  itemLevel: number
}) {
  return (
    <div className="stat overflow-hidden p-2 pb-0">
      <div
        className="stat-title h-10 whitespace-normal font-bold leading-5 opacity-100"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {hasMember ? name : 'No item is being bid on'}
      </div>
      <div className="stat-value flex gap-1">
        <div
          style={{
            backgroundImage: `url(${iconUrl})`,
          }}
          className="bg-loading h-14 w-14 rounded"
        ></div>
        {/* Item Level */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="select-none text-sm opacity-70">
            {hasMember ? 'Item Level' : ''}
          </div>
          <div className="font-md text-base">{itemLevel}</div>
        </div>
      </div>
    </div>
  )
}
