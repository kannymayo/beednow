import { useRef, useState } from 'react'
import clsx from 'clsx'

import { Bidding } from '@/api/bidding'
import Row from './Row'

export default function Summary({
  closeModal,
  finishedBiddings,
}: {
  closeModal: () => void
  finishedBiddings: Bidding[]
}) {
  const refTableScrollContainer = useRef<HTMLDivElement>(null)
  const [hasScolled, setHasScrolled] = useState(false)

  const tableHeader = (
    <tr>
      {/* square it so row content won't leak out when header goes sticky */}
      <th className="rounded-none"></th>
      <th>Name</th>
      <th>Winner</th>
      <th>Amount</th>
      <th>Bidders</th>
      <th>Duration</th>
      <th className="rounded-none">Closed at</th>
    </tr>
  )

  return (
    <div className="flex h-full flex-1 flex-col gap-2">
      <h1 className="text-2xl">Summary</h1>
      <div className="divider mt-1 text-sm text-slate-600">
        0 items in total, 0 items closed at total amount of 0
      </div>

      {/* Table */}
      <div
        ref={refTableScrollContainer}
        onScroll={handleScroll}
        className="subtle-scrollbar w-full overflow-y-scroll"
      >
        <table className="table-compact table w-full">
          {/* head */}
          <thead
            className={clsx(
              {
                'shadow-md': hasScolled,
              },
              'sticky top-0 transition-shadow'
            )}
          >
            {tableHeader}
          </thead>
          <tbody className="">
            {finishedBiddings.map((bidding) => (
              <Row bidding={bidding} key={bidding.id} />
            ))}
          </tbody>
          {/* foot */}
          <tfoot>{tableHeader}</tfoot>
        </table>
      </div>
    </div>
  )

  function handleScroll() {
    const { current: tableScrollContainer } = refTableScrollContainer
    if (!tableScrollContainer) return

    const { scrollTop } = tableScrollContainer
    if (scrollTop > 0) setHasScrolled(true)
    else setHasScrolled(false)
  }
}
