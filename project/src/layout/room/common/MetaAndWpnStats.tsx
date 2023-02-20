import { Bidding } from '@/api/bidding'

type WeaponProps = Bidding['details']['weaponProps']
type Meta = Pick<Bidding['details'], 'slot' | 'type' | 'usableClasses'>

export default function MetaAndWpnStats({
  meta,
  weaponProps,
  isAnyInProgress = false,
}: {
  meta?: Meta
  weaponProps?: WeaponProps
  isAnyInProgress?: boolean
}) {
  const cellMeta = {
    ...(meta?.type && { type: meta?.type }),
    ...(meta?.slot && { slot: meta?.slot }),
  }
  const damageLow = weaponProps?.damageLow
  const damageHigh = weaponProps?.damageHigh
  const cellWeapon = {
    ...(weaponProps?.speed && { Speed: weaponProps?.speed }),
    ...(weaponProps?.damagePerSecond && {
      DPS: weaponProps?.damagePerSecond,
    }),
  }
  const usableClasses = meta?.usableClasses

  return (
    <ul className="flex h-full flex-col flex-wrap gap-y-1 overflow-hidden px-2 pt-2">
      {/* Meta Props */}
      {Object.entries(cellMeta).map(([propName, propValue]) => (
        <li key={propName} className="w-[50%] px-1">
          <div className="input-group input-group-xs grid grid-cols-5 text-sm">
            <span className="col-span-2 select-none truncate bg-slate-700 pl-2 capitalize text-white">
              {propName}
            </span>
            <div className="input input-xs col-span-3 flex items-center justify-center truncate text-sm font-medium">
              {propValue}
            </div>
          </div>
        </li>
      ))}

      {/* Usable classes */}
      {usableClasses && (
        <li key={'usableClasses'} className="min-w-[50%] px-1">
          <div className="input-group input-group-xs input-group-vertical">
            <span className="h-6 select-none truncate bg-slate-700 pl-2 text-sm text-white">
              Usable Classes
            </span>
            <div
              className="input overflow-hidden py-1.5 px-2 text-base leading-5 tracking-tighter"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {usableClasses.join(', ')}
            </div>
          </div>
        </li>
      )}

      {/* Weapon damage range */}
      {(damageLow || damageHigh) && (
        <li key={'weaponDamage'} className="w-[50%] px-1">
          <div className="input-group input-group-xs input-group-vertical">
            <span className="h-6 select-none truncate bg-cyan-600 pl-2 text-sm text-white">
              Weapon Damage
            </span>
            <div className="input input-xs col-span-1 text-center text-base">{`${damageLow} - ${damageHigh}`}</div>
          </div>
        </li>
      )}

      {/* Weapon DPS and speed */}
      {Object.entries(cellWeapon).map(([propName, propValue]) => (
        <li key={propName} className="w-[50%] px-1">
          <div className="input-group input-group-xs grid grid-cols-2 text-sm">
            <span className="col-span-1 select-none truncate bg-cyan-600 pl-2 capitalize text-white">
              {propName}
            </span>
            <div className="input input-xs col-span-1 flex items-center justify-center text-sm font-medium">
              {propValue}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
