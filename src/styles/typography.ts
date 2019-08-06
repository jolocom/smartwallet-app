import { Dimensions, Platform } from 'react-native'

const initialViewportWidth = Dimensions.get('window').width
// const initialViewportHeight = Dimensions.get('window').height

const isSmallViewportWidth = initialViewportWidth < 360

export const fontMain = Platform.OS === 'android' ? 'TTCommons' : 'TT Commons'

export const textXXS = 14
export const textXS = 17
export const textSM = 18
export const textMD = 20
export const textLG = 22
export const textXL = 28
export const text2XL = 30
export const text3XL = 34
export const text4XL = 42

export const textHeader = isSmallViewportWidth ? textXL : text2XL
export const textSubheader = isSmallViewportWidth ? textSM : textMD

// it's unclear if fontWeight does anything
// it may be best to use different names for the different weights
// https://github.com/facebook/react-native/issues/19707
// export const fontWeight = '100'

// PRESETS

export const mainText = {
  fontSize: textHeader,
  fontFamily: fontMain,
}

export const subMainText = {
  fontSize: textSubheader,
  fontFamily: fontMain,
}
