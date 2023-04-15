import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { useHighestOfferAtoms } from '@/store/useOfferAtom'
import { useUserAtoms } from '@/store/useUserAtom'

export default function HeaderCurrentHighest() {
  const [userSelf, isLoggedin] = useUserAtoms().get()
  const highestOffer = useHighestOfferAtoms().get()
  const isSelf = userSelf.uid === highestOffer?.userId

  return (
    <div className="stat @container grid-cols-4 grid-rows-4 gap-x-0 overflow-hidden p-2 pb-0">
      <div className="stat-figure text-secondary col-span-1 col-start-4 row-span-2 row-start-2">
        <CurrencyDollarIcon className="@[135px]:visible invisible h-10 w-10 text-yellow-500" />
      </div>
      <div className="stat-title cols-span-4 row-span-1 select-none">
        Currently at:
      </div>
      <div className="stat-value col-span-3 row-span-2 mr-1 flex items-center justify-end font-mono">
        {highestOffer?.amount || '0'}
      </div>
      <div className="stat-desc col-span-4 row-span-1 box-content flex items-center gap-1 overflow-hidden pr-2">
        {isSelf && (
          <div className="badge badge-sm rounded-sm bg-opacity-100 px-1 opacity-100">
            Me
          </div>
        )}
        {highestOffer?.username || '-'}
      </div>
    </div>
  )
}
