import { Dimensions, Platform } from 'react-native'
import { Colors } from '.'

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

export const centeredText = {
  textAlign: 'center' as 'center',
}

export const baseFontStyles = {
  fontFamily: fontMain,
}

/* PRESETS */

// on 'dark screens' e.g. exception and landing, the main text
export const mainText = {
  ...baseFontStyles,
  fontSize: textHeader,
}

// on 'dark screens' e.g. exception and landing, the smaller text
export const subMainText = {
  ...baseFontStyles,
  fontSize: textSubheader,
}

// this is used for main information such as issuer name, claimCard's main info
//  button text, iOS header
export const standardText = {
  ...baseFontStyles,
  fontSize: textLG,
}

// e.g. Personal, Contact on credentialOverview
export const sectionHeader = {
  ...baseFontStyles,
  fontSize: textXS,
  color: Colors.black040,
}
