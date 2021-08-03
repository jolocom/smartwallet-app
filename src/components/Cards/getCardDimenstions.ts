import { SCREEN_WIDTH } from '~/utils/dimensions'

export interface DefiningOptionScreenWidth {
  originalScreenWidth: number
  containerWidth?: never
}

export interface DefiningOptionAvailabeWidth {
  containerWidth?: number
  originalScreenWidth?: never
}

export type DefiningOption =
  | DefiningOptionScreenWidth
  | DefiningOptionAvailabeWidth

export type CardDimensions = {
  scaledWidth: number
  scaledHeight: number
  scaleBy: number
}

function isScreenWidthDefining(
  definingOption: DefiningOption,
): definingOption is DefiningOptionScreenWidth {
  return (
    'originalScreenWidth' in definingOption &&
    !('containerWidth' in definingOption)
  )
}

function isAvailableWidthDefining(
  definingOption: DefiningOption,
): definingOption is DefiningOptionAvailabeWidth {
  return (
    'containerWidth' in definingOption &&
    !('originalScreenWidth' in definingOption)
  )
}

/**
 * A hook to define how to scale card visual properties.
 * It should either define scale by property by:
 * - originalScreenWidth
 * - widthAvailable
 * @param originalCardWidth - a width of card for iPhoneX
 * @param definingOption - an option that defines how scaled by return param is being calculated
 */
export const getCardDimensions = (
  originalCardWidth: number,
  originalCardHeight: number,
  definingOption: DefiningOption,
): CardDimensions => {
  // when originalScreenWidth should define scaleBy property
  const baseAspectRation = originalCardWidth / originalCardHeight

  let scaleBy: number, cardWidth: number, cardHeight: number

  if (isScreenWidthDefining(definingOption)) {
    scaleBy = SCREEN_WIDTH / definingOption.originalScreenWidth
    if (scaleBy < 1) {
      cardWidth = originalCardWidth * scaleBy
    }
  } else if (isAvailableWidthDefining(definingOption)) {
    if (!definingOption.containerWidth) {
      scaleBy = 1
      cardWidth = originalCardWidth
    } else {
      scaleBy = definingOption.containerWidth / originalCardWidth
      if (scaleBy < 1) {
        cardWidth = definingOption.containerWidth
      }
    }
  } else {
    throw new Error(
      '"definigOption" param in getCardDimensions fn was used incorrectly',
    )
  }

  /**
   * in case screen is larger than originalScreenWidth
   * limit card width to originalCardWidth value
   */
  if (scaleBy > 1) {
    cardWidth = originalCardWidth
    cardHeight = originalCardHeight
  } else {
    cardHeight = (1 / baseAspectRation) * cardWidth!
  }

  return {
    scaledWidth: cardWidth!,
    scaledHeight: cardHeight!,
    scaleBy,
  }
}
