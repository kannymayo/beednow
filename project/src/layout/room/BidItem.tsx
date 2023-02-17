import './BidItem.css'

import { useInProgressBiddingsAtom } from '@/store/useBiddingAtom'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'

export default function BidItem() {
  const [inProgressBiddings, hasMember] = useInProgressBiddingsAtom()

  if (!hasMember)
    return (
      <div className="grid h-full w-full">
        <div className="m-1 bg-slate-100 drop-shadow-lg">
          <h1 className="mx-auto w-full bg-slate-300 py-1 text-center text-2xl">
            Current Bidding
          </h1>
        </div>
      </div>
    )

  const inProgressBidding = inProgressBiddings[0]
  var name,
    iconUrl,
    type,
    slot,
    itemLevel,
    itemId,
    primaryStats,
    secondaryStats,
    equipEffects,
    usableClasses,
    weaponProps,
    bindOn,
    phase
  if (inProgressBidding) {
    ;({
      details: {
        name,
        iconUrl,
        type,
        slot,
        itemLevel,
        id: itemId,
        primaryStats,
        secondaryStats,
        equipEffects,
        usableClasses,
        weaponProps,
        bindOn,
        phase,
      },
    } = inProgressBidding)
  }

  const statsList = (
    <>
      {weaponProps && (
        <ul className="text-yellow-600">
          {Object.entries(weaponProps).map((el) => {
            return (
              <li key={el[0]}>
                {el[0]}: {el[1]}
              </li>
            )
          })}
        </ul>
      )}
      {primaryStats && (
        <ul className="text-slate-800">
          {Object.entries(primaryStats).map((el) => {
            return (
              <li key={el[0]}>
                {el[0]}: {el[1]}
              </li>
            )
          })}
        </ul>
      )}
      {secondaryStats && (
        <ul className="text-green-600">
          {Object.entries(secondaryStats).map((el) => {
            return (
              <li key={el[0]}>
                {el[0]}: {el[1]}
              </li>
            )
          })}
        </ul>
      )}
      {equipEffects && (
        <ul className="text-amber-900 ">
          {equipEffects.map((el) => {
            return <li key={el}>{el}</li>
          })}
        </ul>
      )}

      {usableClasses && (
        <ul className="flex">
          {usableClasses.map((el) => {
            return (
              <li className="badge badge-sm" key={el}>
                {el}
              </li>
            )
          })}
        </ul>
      )}

      {(type || slot || bindOn || phase) && (
        <ul className="flex gap-1">
          {[type, slot, slot, bindOn, phase]
            .filter((el) => el)
            .map((el, idx) => (
              <li className="badge badge-sm badge-info" key={`${idx}${el}`}>
                {el}
              </li>
            ))}
        </ul>
      )}
    </>
  )

  return (
    <div className="grid h-full w-full ">
      <div className="m-1 mb-0 overflow-hidden bg-slate-100 drop-shadow-lg">
        <div className="grid h-full w-full grid-cols-2 grid-rows-3">
          {/* Name, Bidding Info, Image, Countdown */}
          <div className="col-span-2 col-start-1 row-span-1 row-start-1">
            <div className="stats h-full w-full grid-cols-3 overflow-hidden rounded-none shadow">
              <div className="stat overflow-hidden p-2 pb-0">
                <div className="stat-title line-clamps-2 whitespace-normal font-bold opacity-100">
                  {name} sdad asd asd asdasda sad
                </div>
                <div className="stat-value flex gap-1">
                  <img
                    src={iconUrl}
                    className="mask h-14 w-14 rounded-md"
                  ></img>
                  {/* Item Level */}
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <div className="text-sm opacity-70">Item Level</div>
                    <div className="font-md text-base">{itemLevel}</div>
                  </div>
                </div>
              </div>

              <div className="stat gap-x-0 overflow-hidden p-2 pb-0">
                <div className="stat-figure text-secondary">
                  <CurrencyDollarIcon className="h-10 w-10 text-yellow-500" />
                </div>
                <div className="stat-title">Currently at:</div>
                <div className="stat-value">4,200</div>
                <div className="stat-desc">User Name</div>
              </div>

              <div className="stat overflow-hidden p-2 pb-0">
                <div className="stat-value text-center text-8xl">
                  <span className="countdown font-mono ">
                    <span style={{ '--value': 36 }}></span>
                  </span>
                </div>
                <div className="stat-desc">Countdown</div>
              </div>
            </div>

            {/* <h1 className="mx-auto w-full bg-slate-300 py-1 text-center text-2xl">
              {name}
            </h1>
            <div className="p-2">
              <img
                src={iconUrl}
                className="mask h-12 w-12 rounded-md drop-shadow-lg"
              ></img>
              
            </div> */}
          </div>

          {/* Stats */}
          <div className="col-span-2 col-start-1 row-span-2 row-start-2">
            <div className="p-2">{statsList}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
