interface FlatTooltipJSON {
  name: string
  icon: string
  quality: string
  [key: string]: string
}

type ParseError = 'No containing element found'

export type BidItem = {
  uuid: string
  details: ItemFromAPI
}

export type ItemFromAPI = {
  id: number
  name: string
  iconUrl: string
  quality: string

  bindOn: string
  itemLevel: number
  phase: string
  requireLevel?: number
  usableClasses?: string[]

  type: string
  slot?: string

  weaponProps?: {
    damagePerSecond: number
    damageLow: number
    damageHigh: number
    speed: number
  }

  primaryStats?: {
    stamina: number
    intellect: number
    spirit: number
    agility: number
    strength: number
    armor: number
  }

  secondaryStats?: {
    ratingDefense: number
    ratingDodge: number
    ratingParry: number
    ratingBlock: number
    ratingHit: number
    ratingCrit: number
    ratingHaste: number
    ratingExpertise: number
    blockValue: number
    manaPer5: number
    healthPer5: number
    attackPower: number
    spellPower: number
    spellPenetration: number
    armorPenetration: number
    resilience: number
  }

  equipEffects: string[]
}

type ItemFromAPIAlmost = Omit<
  ItemFromAPI,
  'name' | 'iconUrl' | 'quality' | 'id'
>

interface ItemFromTooltipAPI {
  bindOn: string
  itemLevel: number
  phase: string

  type: string
  slot?: string

  requireLevel?: number
  usableClasses?: string[]

  equipEffect1?: string
  equipEffect2?: string
  equipEffect3?: string

  wDamagePerSecond?: number
  wDamageLow?: number
  wDamageHigh?: number
  wSpeed?: number

  psStamina?: number
  psIntellect?: number
  psSpirit?: number
  psAgility?: number
  psStrength?: number
  psArmor?: number

  ssRatingDefense?: number
  ssRatingDodge?: number
  ssRatingParry?: number
  ssRatingBlock?: number
  ssRatingHit?: number
  ssRatingCrit?: number
  ssRatingHaste?: number
  ssRatingExpertise?: number

  ssResilience?: number
  ssBlockValue?: number
  ssManaPer5?: number
  ssHealthPer5?: number

  ssAttackPower?: number
  ssSpellPower?: number
  ssSpellPenetration?: number
  ssArmorPenetration?: number
}

export default function deepRead(
  almostFlatJson: FlatTooltipJSON,
  id: number = 0
): ItemFromAPI {
  function cleanAndParse(xmlStr: string): Element {
    const p = new DOMParser()
    // replace br with br/
    const woBadBr = `<div>${xmlStr.replace(/<br>/g, '<br/>')}</div>`
    const woBadNbsp = woBadBr.replace(/&nbsp;/g, ' ')
    return p.parseFromString(woBadNbsp, 'text/xml').children[0]
  }

  type ShadowTree = {
    tagName: string
    children: ShadowTree[]
    el: Element
  }

  function keepOnly(el: Element, tagName: string, isRoot = true): ShadowTree {
    // current node
    let currentResult: ShadowTree = {
      tagName: el.tagName === tagName ? el.tagName : '',
      children: [],
      el: el,
    }

    // recursive for children
    for (const child of el.children) {
      const childResult = keepOnly(child, tagName, false)
      if (childResult.tagName === '') {
        // takeover the child's children
        currentResult.children.push(...childResult.children)
      } else {
        currentResult.children.push(childResult)
      }
    }

    if (isRoot) {
      currentResult.tagName = el.tagName
    }
    return currentResult
  }

  function get2DTextArray(el: Element): string[][] | null {
    function getTextOfThisNode(el: Element): string[] | null {
      let textArray = []
      for (const childNode of el.childNodes) {
        // if childNode is a text node
        if (childNode.nodeType === 3 && childNode.textContent !== null) {
          textArray.push(childNode.textContent.trim())
        }
      }

      textArray = textArray.filter(Boolean)
      if (textArray.length > 0) {
        return textArray as string[]
      } else {
        return null
      }
    }

    // prepare return
    let result: string[][] | null = null

    // gather text from current level
    const textArray = getTextOfThisNode(el)
    if (textArray !== null) {
      result = [textArray]
    }

    // collect textArray from children
    for (const child of el.children) {
      let childResult = get2DTextArray(child)
      if (childResult !== null) {
        if (result === null) {
          result = childResult
        } else {
          result.push(...childResult)
        }
      }
    }

    if (result === null) {
      return null
    } else {
      return result
    }
  }

  function matchAndDiscard(
    regexSet: { [key: string]: RegExp },
    twoDArr: string[][]
  ) {
    // stay pure: custom deep copy 2d array
    twoDArr = twoDArr.map((oneDArr) => [...oneDArr])
    regexSet = { ...regexSet }
    const result: { [key: string]: any } = {}

    for (let i = 0; i < twoDArr.length; i++) {
      // edge case as we are deleting attributes from regexSet
      if (Object.keys(regexSet).length === 0) {
        break
      }
      // loop through regexSet
      for (const [key, regex] of Object.entries(regexSet)) {
        const foundIndex = twoDArr.findIndex((oneDArr) => {
          let matched = oneDArr.join(':').match(regex)

          // form result according to regexSet
          if (matched) {
            result[key] = matched[1]
            return true
          }
        })
        if (foundIndex !== -1) {
          // don't use splice, one element can get matched multiple times
          // twoDArr.splice(foundIndex, 1)
          delete regexSet[key]
          break
        }
      }
    }

    // ?over-confident assertion
    return result as ItemFromTooltipAPI
  }

  function hackyGetTypeSlot(el: Element) {
    let firstTablesSecondChildTable
    try {
      firstTablesSecondChildTable = keepOnly(el, 'table').children[0]
        .children[1].el
    } catch (e) {
      const error: ParseError = 'No containing element found'
      return { error }
    }

    let tdForSlot = firstTablesSecondChildTable.querySelector('td')?.textContent
    let spanForType =
      firstTablesSecondChildTable.querySelector('span')?.textContent

    return {
      ...(spanForType && { type: spanForType }),
      ...(tdForSlot && { slot: tdForSlot }),
    }
  }

  function hackyGetUsableClasses(el: Element): string[] | [] {
    const classes = []
    const magicElements: NodeList = el.querySelectorAll('table div a')
    for (const el of magicElements) {
      classes.push(el.textContent)
    }

    const purgedClasses = classes.filter(Boolean) as NonNullable<string[]>
    return purgedClasses
  }

  function parseItemWithBestEffort(xmlStr: string): ItemFromTooltipAPI {
    let regexSet = {
      bindOn: /Binds when ([a-z]+)(?:$)*/,
      wDamagePerSecond: /(\d+\.?\d+) damage per second/,
      wDamageLow: /(\d+) - (?:\d+) Damage/,
      wDamageHigh: /(?:\d+) - (\d+) Damage/,
      wSpeed: /Speed:(\d+\.?\d+)/,

      itemLevel: /Item Level:(\d+)/,
      phase: /Phase (\d+)/,
      requireLevel: /Requires Level:(\d+)/,

      psStamina: /^\+(\d+) Stamina/,
      psIntellect: /^\+(\d+) Intellect/,
      psSpirit: /^\+(\d+) Spirit/,
      psStrength: /^\+(\d+) Strength/,
      psAgility: /^\+(\d+) Agility/,

      ssRatingCrit: /^Equip: Improves critical strike rating by:(\d+)/,
      ssRatingHit: /^Equip: Improves hit rating by:(\d+)/,
      ssRatingHaste: /^Equip: Improves haste rating by:(\d+)/,
      ssRatingBlock: /^Equip: Improves block rating by:(\d+)/,
      ssRatingDodge: /^Equip: Improves dodge rating by:(\d+)/,
      ssRatingDefense: /^Equip: Improves defense rating by:(\d+)/,
      ssRatingParry: /^Equip: Improves parry rating by:(\d+)/,

      ssSpellPower: /^Increases spell power by:(\d+)/,
      ssAttackPower: /^Increases attack power by:(\d+)/,
      ssResilience: /^Equip: Improves your resilience by:(\d+)/,
      ssBlockValue: /^Equip: Increases the block value of your shield by:(\d+)/,
      ssManaPer5: /^Equip: Restores (\d+) mana per 5 sec\./,
      // ssHealthPer5: /^Equip: Restores (\d+) health per 5 sec\./,

      ssSpellPenetration: /^Equip: Improves spell penetration by:(\d+)/,
      ssArmorPenetration: /^Equip: Improves armor penetration rating by:(\d+)/,

      equipEffect1: /^(Your .*)$/,
      equipEffect2: /^(When .*)$/,
      equipEffect3: /^(Each .*)$/,
    }

    const parsed = cleanAndParse(almostFlatJson.tooltip)
    const typeSlot = hackyGetTypeSlot(parsed)
    const typeSlotResult =
      typeSlot.error && typeSlot.error.length > 0 ? { type: 'N/A' } : typeSlot
    const usableClasses = hackyGetUsableClasses(parsed)
    const twoDArray = get2DTextArray(parsed)
    const extracted = matchAndDiscard(regexSet, twoDArray as string[][])

    return {
      ...extracted,
      ...typeSlotResult,
      ...(usableClasses.length > 0 && { usableClasses }),
    }
  }

  function purgeUndefined(obj: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as Record<string, any>
  }

  function rearrangeItem(item: ItemFromTooltipAPI): ItemFromAPIAlmost {
    let weaponProps: any = {
      damagePerSecond: item.wDamagePerSecond,
      damageLow: item.wDamageLow,
      damageHigh: item.wDamageHigh,
      speed: item.wSpeed,
    }

    let primaryStats: any = {
      stamina: item.psStamina,
      intellect: item.psIntellect,
      spirit: item.psSpirit,
      strength: item.psStrength,
      agility: item.psAgility,
    }

    let secondaryStats: any = {
      ratingCrit: item.ssRatingCrit,
      ratingHit: item.ssRatingHit,
      ratingHaste: item.ssRatingHaste,
      ratingBlock: item.ssRatingBlock,
      ratingDodge: item.ssRatingDodge,
      ratingDefense: item.ssRatingDefense,
      ratingParry: item.ssRatingParry,
      spellPower: item.ssSpellPower,
      attackPower: item.ssAttackPower,
      resilience: item.ssResilience,
      blockValue: item.ssBlockValue,
      manaPer5: item.ssManaPer5,
      spellPenetration: item.ssSpellPenetration,
      armorPenetration: item.ssArmorPenetration,
    }

    weaponProps = purgeUndefined(weaponProps)
    primaryStats = purgeUndefined(primaryStats)
    secondaryStats = purgeUndefined(secondaryStats)
    let equipEffects = [
      item.equipEffect1,
      item.equipEffect2,
      item.equipEffect3,
    ].filter(Boolean)

    return {
      phase: item.phase,
      itemLevel: item.itemLevel,
      bindOn: item.bindOn,
      requireLevel: item.requireLevel,
      type: item.type,
      slot: item.slot,
      // ts went crazy here, so I had to do this
      ...((equipEffects.length > 0 && { equipEffects: equipEffects }) as {
        equipEffects: string[]
      }),
      usableClasses: item.usableClasses,

      ...(Object.keys(weaponProps).length > 0 && { weaponProps }),
      ...(Object.keys(primaryStats).length > 0 && { primaryStats }),
      ...(Object.keys(secondaryStats).length > 0 && { secondaryStats }),
    }
  }

  return {
    id,
    name: almostFlatJson.name,
    iconUrl: `https://wow.zamimg.com/images/wow/icons/large/${almostFlatJson.icon}.jpg`,
    // quality 4 is epic
    quality: almostFlatJson.quality,
    ...rearrangeItem(parseItemWithBestEffort(almostFlatJson.tooltip)),
  }
}
