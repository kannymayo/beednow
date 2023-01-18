interface AlmostFlatJSON {
  name: string
  icon: string
  quality: string
  [key: string]: string
}

export default function deepRead(almostFlatJson: AlmostFlatJSON) {
  function cleanAndParse(xmlStr: string): Element {
    const p = new DOMParser()
    // replace br with br/
    const woBadBr = `<div>${xmlStr.replace(/<br>/g, '<br/>')}</div>`
    const woBadNbsp = woBadBr.replace(/&nbsp;/g, ' ')

    return p.parseFromString(woBadNbsp, 'text/xml').children[0]
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

    return result
  }

  function hackyGetTypeAndSlot(el: Element) {
    let tables = Array.from(el.querySelectorAll('table[width]'))
    tables = tables.filter((table) => table.innerHTML.includes('scstart'))
    if (tables.length === 0) {
      return {}
    }

    let tdForSlot = tables[0].querySelector('td')?.textContent
    let spanForType = tables[0].querySelector('span')?.textContent

    return {
      type: spanForType,
      slot: tdForSlot,
    }
  }

  function hackyGetUsableClasses(el: Element) {
    const classes = []
    const magicElements: NodeList = el.querySelectorAll('table div a')
    for (const el of magicElements) {
      classes.push(el.textContent)
    }
    return classes
  }

  function parseItemWithBestEffort(xmlStr: string): { [key: string]: any } {
    let regexSet = {
      bindOn: /Binds when ([a-z]+)(?:$)*/,
      wDamagePerSecond: /(\d+\.?\d+) damage per second/,
      wDamageLow: /(\d+) - (?:\d+) Damage/,
      wDamageHigh: /(?:\d+) - (\d+) Damage/,
      wSpeed: /Speed:(\d+\.?\d+)/,

      itemLevel: /Item Level:(\d+)/,
      phase: /Phase (\d+)/,
      requireLevel: /Requires Level:(\d+)/,

      sStamina: /^\+(\d+) Stamina/,
      sIntellect: /^\+(\d+) Intellect/,
      sSpirit: /^\+(\d+) Spirit/,
      sStrength: /^\+(\d+) Strength/,
      sAgility: /^\+(\d+) Agility/,

      sSpellPower: /^Increases spell power by (\d+)/,
      sRatingCrit: /^Equip: Improves critical strike rating by:(\d+)/,
      sRatingHit: /^Equip: Improves hit rating by:(\d+)/,
      sRatingHaste: /^Equip: Improves haste rating by:(\d+)/,

      equipEffect1: /^(Your .*)$/,
      equipEffect2: /^(When .*)$/,
      equipEffect3: /^(Each .*)$/,
    }

    const parsed = cleanAndParse(almostFlatJson.tooltip)
    const typeAndSlot = hackyGetTypeAndSlot(parsed)
    const usableClasses = hackyGetUsableClasses(parsed)
    const twoDArray = get2DTextArray(parsed)
    const extracted = matchAndDiscard(regexSet, twoDArray as string[][])

    return {
      ...extracted,
      ...typeAndSlot,
      usableClasses,
    }
  }

  return {
    name: almostFlatJson.name,
    iconUrl: `https://wow.zamimg.com/images/wow/icons/medium/${almostFlatJson.icon}.jpg`,
    // quality 4 is epic
    quality: almostFlatJson.quality,
    ...parseItemWithBestEffort(almostFlatJson.tooltip),
  }
}
