import { Dimensions, Platform } from 'react-native'

const SCREEN_SIZE = Dimensions.get('window')

enum ScreenSize {
  xsmall = 'xsmall',
  small = 'small',
  medium = 'medium',
  large = 'large',
}

interface StyleValues<T extends string | number> {
  [ScreenSize.xsmall]: T
  [ScreenSize.small]: T
  [ScreenSize.medium]: T
  [ScreenSize.large]: T
}

interface Breakpoint {
  width: number
  height: number
}

const breakpoints: Record<string, Breakpoint> = {
  large: {
    width: 414,
    height: 814,
  },
  medium: {
    width: 380,
    height: 700,
  },
  small: {
    width: 360,
    height: 640,
  },
}

const isBreakpoint = (breakpointSize: ScreenSize) => {
  if (Platform.OS === 'ios') {
    return SCREEN_SIZE.height >= breakpoints[breakpointSize].height
  }
  return (
    SCREEN_SIZE.width >= breakpoints[breakpointSize].width &&
    SCREEN_SIZE.height >= breakpoints[breakpointSize].height
  )
}

// NOTE: Maps through the breakpoints (biggest to smallest) and returns the @ScreenSize of the device if it's
// bigger than the breakpoint. In case the map didn't find anything, means the screen is smaller than all the
// breakpoints, returning the smallest @ScreenSize.
const getScreenSize = (): ScreenSize => {
  const size = (Object.keys(breakpoints) as ScreenSize[]).find(isBreakpoint)
  return size ? size : ScreenSize.xsmall
}

const BP = <T extends string | number>(values: StyleValues<T>): T =>
  values[getScreenSize()]

export default BP
