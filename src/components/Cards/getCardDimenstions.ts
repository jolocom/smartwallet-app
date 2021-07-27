import { Dimensions } from 'react-native'

export type DefiningOption =
  | { baseScreenWidth: number; availableWidth?: number }
  | { baseScreenWidth?: number; availableWidth: number }
export type CardDimensions = {
  cardWidth: number
  cardHeight: number
  scaleBy: number
}
function isScreenWidthDefinig(
  baseScreenWidth: number | undefined,
): baseScreenWidth is number {
  return typeof baseScreenWidth === 'number'
}
function isAvailableWidthDefinig(
  baseScreenWidth: number | undefined,
): baseScreenWidth is number {
  return typeof baseScreenWidth === 'number'
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
  const { baseScreenWidth, availableWidth } = definingOption
  const baseAspectRation = baseCardWidth / baseCardHeight
  let scaleBy: number, cardWidth: number, cardHeight: number
  if (isScreenWidthDefinig(baseScreenWidth)) {
    scaleBy = Dimensions.get('screen').width / baseScreenWidth
    /**
     * in case screen is larger than baseScreenWidth
     * limit card width to baseCardWidth value
     */
    if (scaleBy > 1) {
      cardWidth = baseCardWidth
      cardHeight = baseCardHeight
    } else {
      cardWidth = baseCardWidth * scaleBy
      cardHeight = (1 / baseAspectRation) * cardWidth
    }
  }
  // when availableWidth should define scaleBy property
  else if (isAvailableWidthDefinig(availableWidth)) {
    scaleBy = availableWidth / baseCardWidth
    /**
     * in case screen is larger than baseScreenWidth
     * limit card width to baseCardWidth value
     */
    if (scaleBy > 1) {
      cardWidth = baseCardWidth
      cardHeight = baseCardHeight
    } else {
      cardWidth = availableWidth
      cardHeight = (1 / baseAspectRation) * cardWidth
    }
  } else {
    throw new Error('"definigOption" param was used incorrectly')
  }
  return {
    cardWidth,
    cardHeight,
    scaleBy,
  }
}
