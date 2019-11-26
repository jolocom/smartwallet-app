import { Dimensions } from 'react-native'

enum ScreenSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

const breakpoints = {
  [ScreenSize.large]: {
    width: 360,
    height: 720,
  },
  [ScreenSize.medium]: {
    width: 360,
    height: 640,
  },
}

interface StyleValues<T> {
  [ScreenSize.small]: T
  [ScreenSize.medium]: T
  [ScreenSize.large]: T
}

const getScreenSize = (): ScreenSize => {
  const { width, height } = Dimensions.get('window')
  const screenSize = { width, height }

  if (
    screenSize.width >= breakpoints.large.width &&
    screenSize.height >= breakpoints.large.height
  ) {
    return ScreenSize.large
  } else if (
    screenSize.width >= breakpoints.medium.width &&
    screenSize.height >= breakpoints.medium.height
  ) {
    return ScreenSize.medium
  } else {
    return ScreenSize.small
  }
}

export const BP = <T>(values: StyleValues<T>): T => {
  const size = getScreenSize()
  return values[size]
}
