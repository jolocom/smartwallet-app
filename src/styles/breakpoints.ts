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

interface StyleValues {
  [ScreenSize.small]: number | string
  [ScreenSize.medium]: number | string
  [ScreenSize.large]: number | string
}

const getScreenSize = (): ScreenSize => {
  const { width, height } = Dimensions.get('window')
  const screenSize = { width, height }

  if (screenSize >= breakpoints.large) {
    return ScreenSize.large
  } else if (screenSize >= breakpoints.medium) {
    return ScreenSize.medium
  } else {
    return ScreenSize.small
  }
}

export const BP = (values: StyleValues): number | string => {
  const size = getScreenSize()
  console.log(size)
  return values[size]
}
