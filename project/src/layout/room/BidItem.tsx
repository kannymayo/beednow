import { useInProgressBiddingsAtom } from '@/store/useBiddingAtom'

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
  return (
    <div className="grid h-full w-full ">
      <div className="m-1 mb-0 overflow-hidden bg-slate-100 drop-shadow-lg">
        <h1 className="mx-auto w-full bg-slate-300 py-1 text-center text-2xl">
          {name}
        </h1>
        <div className="p-2">
          <img
            src={iconUrl}
            className="mask h-20 w-20 rounded-md drop-shadow-lg"
          ></img>
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

          {(type || slot || itemLevel || bindOn || phase) && (
            <ul className="flex gap-1">
              {[type, slot, slot, itemLevel, bindOn, phase]
                .filter((el) => el)
                .map((el, idx) => (
                  <li className="badge badge-sm badge-info" key={`${idx}${el}`}>
                    {el}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
