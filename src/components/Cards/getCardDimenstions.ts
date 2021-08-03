import { Dimensions } from 'react-native'

export interface DefiningOptionScreenWidth {
  baseScreenWidth: number
  availableWidth?: never
}

export interface DefiningOptionAvailabeWidth {
  availableWidth: number
  baseScreenWidth?: never
}

export type DefiningOption =
  | DefiningOptionScreenWidth
  | DefiningOptionAvailabeWidth

export type CardDimensions = {
  cardWidth: number
  cardHeight: number
  scaleBy: number
}

function isScreenWidthDefining(
  definingOption: DefiningOption,
): definingOption is DefiningOptionScreenWidth {
  return (
    'baseScreenWidth' in definingOption &&
    typeof definingOption.baseScreenWidth === 'number' &&
    !('availableWidth' in definingOption)
  )
}

function isAvailableWidthDefining(
  definingOption: DefiningOption,
): definingOption is DefiningOptionAvailabeWidth {
  return (
    'availableWidth' in definingOption &&
    typeof definingOption.availableWidth === 'number' &&
    !('baseScreenWidth' in definingOption)
  )
}

/**
 * A hook to define how to scale card visual properties.
 * It should either define scale by property by:
 * - baseScreenWidth
 * - widthAvailable
 * @param baseCardWidth - a width of card for iPhoneX
 * @param definingOption - an option that defines how scaled by return param is being calculated
 */
export const getCardDimensions = (
  baseCardWidth: number,
  baseCardHeight: number,
  definingOption: DefiningOption,
): CardDimensions => {
  // when baseScreenWidth should define scaleBy property
  const baseAspectRation = baseCardWidth / baseCardHeight
  let scaleBy: number, cardWidth: number, cardHeight: number
  if (isScreenWidthDefining(definingOption)) {
    scaleBy = Dimensions.get('screen').width / definingOption.baseScreenWidth
    if (scaleBy < 1) {
      cardWidth = baseCardWidth * scaleBy
    }
  }
  // when availableWidth should define scaleBy property
  else if (isAvailableWidthDefining(definingOption)) {
    scaleBy = definingOption.availableWidth / baseCardWidth
    if (scaleBy < 1) {
      cardWidth = definingOption.availableWidth
    }
  } else {
    throw new Error(
      '"definigOption" param in getCardDimensions fn was used incorrectly',
    )
  }
  /**
   * in case screen is larger than baseScreenWidth
   * limit card width to baseCardWidth value
   */
  if (scaleBy > 1) {
    cardWidth = baseCardWidth
    cardHeight = baseCardHeight
  } else {
    cardHeight = (1 / baseAspectRation) * cardWidth!
  }
  return {
    cardWidth: cardWidth!,
    cardHeight: cardHeight!,
    scaleBy,
  }
}
