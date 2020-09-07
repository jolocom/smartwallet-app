import { Colors } from './colors'
import BP from './breakpoints'

export enum Fonts {
  Regular = 'TTCommons-Regular',
  Medium = 'TTCommons-Medium',
  Light = 'TTCommons-Light',
}

export const TextStyle = {
  middleTitleRegular: {
    fontFamily: Fonts.Regular,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 0,
    color: Colors.white90,
  },
  middleSubtitle: {
    fontFamily: Fonts.Regular,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0.14,
    color: Colors.white,
    opacity: 0.7,
  },
  largeSubtitle: {
    fontFamily: Fonts.Regular,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.15,
    color: Colors.white,
    opacity: 0.8,
  },
  seedPhrase: {
    fontFamily: Fonts.Medium,
    fontSize: BP({ large: 40, medium: 40, small: 32, xsmall: 32 }),
    lineHeight: 54,
    letterSpacing: 0,
    color: Colors.activity,
  },
}

type FontSetI = {
  fontSize: number
  lineHeight: number
  letterSpacing: number
  color: Colors
}
const sizes = ['big', 'middle', 'mini', 'tiniest'] as const
export type TitleSizes = typeof sizes[number]

const arrangeFontStyle = (
  fontSize: number,
  lineHeight: number,
  letterSpacing: number,
  color: Colors,
): FontSetI => ({
  fontSize,
  lineHeight,
  letterSpacing,
  color,
})

export const TITLE_SETS: Record<TitleSizes, FontSetI> = {
  big: {
    ...arrangeFontStyle(
      BP({ xsmall: 26, small: 30, medium: 34, large: 34 }),
      BP({ xsmall: 32, small: 36, medium: 40, large: 40 }),
      0,
      Colors.white90,
    ),
  },
  middle: {
    ...arrangeFontStyle(
      BP({ xsmall: 24, small: 28, medium: 28, large: 28 }),
      BP({ xsmall: 28, small: 32, medium: 32, large: 32 }),
      0,
      Colors.white90,
    ),
  },
  mini: {
    ...arrangeFontStyle(
      BP({ xsmall: 14, small: 18, medium: 18, large: 18 }),
      BP({ xsmall: 20, small: 24, medium: 24, large: 24 }),
      0,
      Colors.white90,
    ),
  },
  tiniest: {
    ...arrangeFontStyle(14, 20, 0, Colors.white70),
  },
}

export const SUBTITLE_SETS = {
  big: {
    ...arrangeFontStyle(
      BP({ xsmall: 18, small: 20, medium: 22, large: 22 }),
      BP({ xsmall: 22, small: 24, medium: 26, large: 26 }),
      BP({ xsmall: 0.12, small: 0.14, medium: 0.15, large: 0.15 }),
      BP({
        xsmall: Colors.white90,
        small: Colors.white90,
        medium: Colors.white80,
        large: Colors.white80,
      }),
    ),
  },
  middle: {
    ...arrangeFontStyle(
      BP({ xsmall: 16, small: 16, medium: 20, large: 20 }),
      BP({ xsmall: 18, small: 18, medium: 22, large: 22 }),
      BP({ xsmall: 0.11, small: 0.11, medium: 0.14, large: 0.14 }),
      BP({
        xsmall: Colors.white90,
        small: Colors.white90,
        medium: Colors.white70,
        large: Colors.white70,
      }),
    ),
  },
  mini: {
    ...arrangeFontStyle(
      BP({ xsmall: 14, small: 16, medium: 16, large: 16 }),
      BP({ xsmall: 14, small: 16, medium: 16, large: 16 }),
      BP({ xsmall: 0, small: 0, medium: 0, large: 0 }),
      Colors.white40,
    ),
  },
  tiniest: {
    ...arrangeFontStyle(14, 20, 0, Colors.white70),
  },
}
