import { Bidding } from '@/api/bidding'

type PriStats = Bidding['details']['primaryStats']
type SecStats = Bidding['details']['secondaryStats']
type EquipEffect = Bidding['details']['equipEffects']

const RatingLookup: Record<string, string> = {
  ratingDefense: 'Defense',
  ratingDodge: 'Dodge',
  ratingParry: 'Parry',
  ratingBlock: 'Block',
  ratingHit: 'Hit',
  ratingCrit: 'Crit',
  ratingHaste: 'Haste',
  ratingExpertise: 'Expertise',
  blockValue: 'Block Value',
  manaPer5: 'MP per 5',
  healthPer5: 'HP per 5',
  attackPower: 'Attack power',
  spellPower: 'Spell power',
  spellPenetration: 'Spell Pen.',
  armorPenetration: 'Armor Pen',
  resilience: 'Resilience',
}

export default function StatsAndEqpEffects({
  priStats = {},
  secStats = {},
  equipEffects = [],
  isAnyInProgress,
}: {
  priStats?: PriStats
  secStats?: SecStats
  equipEffects?: EquipEffect
  isAnyInProgress?: boolean
}) {
  return (
    <ul className="flex h-full flex-col flex-wrap content-start items-start gap-y-1 overflow-hidden px-2 py-1">
      {/* Stats width 1/3 */}
      {/* Primary */}
      {Object.entries(priStats).map(([statName, statValue]) => (
        <li key={statName} className=" w-[33.3%] px-1">
          <div className="input-group input-group-xs grid grid-cols-3">
            <span className="col-span-2 flex-1 select-none truncate bg-yellow-800 pl-2 text-sm capitalize text-white">
              {statName}
            </span>
            <div className="input input-xs flex-1 text-center text-base">
              {statValue}
            </div>
          </div>
        </li>
      ))}
      {/* Secondary */}
      {Object.entries(secStats).map(([statName, statValue]) => (
        <li key={statName} className=" w-[33.3%] px-1">
          <div className="input-group input-group-xs grid grid-cols-3">
            <span className="col-span-2 select-none truncate bg-green-900 pl-2 text-sm capitalize text-white">
              {RatingLookup[statName] || statName}
            </span>
            <div className="input input-xs text-center text-base">
              {statValue}
            </div>
          </div>
        </li>
      ))}

      {/* Equip effect, width max 2/3 */}
      {equipEffects.map((desc) => (
        <li key={desc} className="min-w-[33.3%] max-w-[66.6%] px-1">
          <div className="input-group input-group-vertical input-group-sm">
            <span className="h-6 select-none bg-yellow-800 px-2 text-sm capitalize text-white">
              equip effect
            </span>
            <div
              className="input flex-1 overflow-hidden py-1.5 px-2 text-base leading-5 tracking-tighter"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {desc}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
