import { Colors } from '~/utils/colors'
import { ScreenSize, getScreenSize } from '~/utils/breakpoints'
import { JoloTextKind } from '~/components/JoloText'

export enum Fonts {
  Regular = 'TTCommons-Regular',
  Medium = 'TTCommons-Medium',
  Light = 'TTCommons-Light',
}

type FontSetI = {
  fontSize: number
  lineHeight: number
  letterSpacing: number
  color: Colors
  fontFamily: Fonts
}

export enum JoloTextSizes {
  big = 'big',
  middle = 'middle',
  mini = 'mini',
  tiniest = 'tiniest',
}

type UnscaledFontStyles = Partial<Record<ScreenSize, FontSetI>>

type FontsConfig = Record<
  JoloTextKind,
  Record<JoloTextSizes, UnscaledFontStyles>
>

export const scaleFont = (font: UnscaledFontStyles) => {
  return font[getScreenSize()] ?? font.large
}

export const fonts: FontsConfig = {
  [JoloTextKind.title]: {
    [JoloTextSizes.tiniest]: {
      [ScreenSize.large]: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        color: Colors.white70,
        fontFamily: Fonts.Medium,
      },
    },
    [JoloTextSizes.mini]: {
      [ScreenSize.large]: {
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0,
        color: Colors.white90,
        fontFamily: Fonts.Medium,
      },
      [ScreenSize.xsmall]: {
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: 0,
        color: Colors.white90,
        fontFamily: Fonts.Medium,
      },
    },
    [JoloTextSizes.middle]: {
      [ScreenSize.large]: {
        fontSize: 28,
        lineHeight: 32,
        letterSpacing: 0,
        color: Colors.white90,
        fontFamily: Fonts.Medium,
      },
      [ScreenSize.xsmall]: {
        fontSize: 24,
        lineHeight: 28,
        letterSpacing: 0,
        color: Colors.white90,
        fontFamily: Fonts.Medium,
      },
    },
    [JoloTextSizes.big]: {
      [ScreenSize.large]: {
        fontSize: 34,
        lineHeight: 40,
        letterSpacing: 0,
        color: Colors.white90,
        fontFamily: Fonts.Medium,
      },
      [ScreenSize.small]: {
        fontSize: 30,
        lineHeight: 36,
        letterSpacing: 0,
        color: Colors.white90,
        fontFamily: Fonts.Medium,
      },
      [ScreenSize.xsmall]: {
        fontSize: 26,
        lineHeight: 32,
        letterSpacing: 0,
        color: Colors.white90,
        fontFamily: Fonts.Medium,
      },
    },
  },
  [JoloTextKind.subtitle]: {
    [JoloTextSizes.tiniest]: {
      [ScreenSize.large]: {
        fontSize: 14,
        lineHeight: 14,
        letterSpacing: 0,
        color: Colors.white40,
        fontFamily: Fonts.Regular,
      },
    },
    [JoloTextSizes.mini]: {
      [ScreenSize.large]: {
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0,
        color: Colors.white40,
        fontFamily: Fonts.Regular,
      },
      [ScreenSize.xsmall]: {
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0,
        color: Colors.white40,
        fontFamily: Fonts.Regular,
      },
    },
    [JoloTextSizes.middle]: {
      [ScreenSize.large]: {
        fontSize: 20,
        lineHeight: 22,
        letterSpacing: 0.14,
        color: Colors.white70,
        fontFamily: Fonts.Regular,
      },
      [ScreenSize.small]: {
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0.11,
        color: Colors.white90,
        fontFamily: Fonts.Regular,
      },
      [ScreenSize.xsmall]: {
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0.11,
        color: Colors.white90,
        fontFamily: Fonts.Regular,
      },
    },
    [JoloTextSizes.big]: {
      [ScreenSize.large]: {
        fontSize: 22,
        lineHeight: 26,
        letterSpacing: 0.15,
        color: Colors.white80,
        fontFamily: Fonts.Regular,
      },
      [ScreenSize.small]: {
        fontSize: 20,
        lineHeight: 24,
        letterSpacing: 0.14,
        color: Colors.white90,
        fontFamily: Fonts.Regular,
      },
      [ScreenSize.xsmall]: {
        fontSize: 18,
        lineHeight: 22,
        letterSpacing: 0.12,
        color: Colors.white90,
        fontFamily: Fonts.Regular,
      },
    },
  },
}
