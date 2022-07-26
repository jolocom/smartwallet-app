import {
  CardStyleInterpolators,
  StackCardInterpolationProps,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack'

export const SCREEN_HEADER_HEIGHT = 50

export const screenTransitionSlideFromRight = {
  ...TransitionPresets.SlideFromRightIOS,
}

export const screenTransitionSlideFromBottom =
  TransitionPresets.ModalSlideFromBottomIOS

export const screenDisableGestures = { gestureEnabled: false }

export const screenTransitionFromBottomDisabledGestures = {
  ...screenTransitionSlideFromBottom,
  ...screenDisableGestures,
}

export const transparentModalOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
}

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

export const transparentModalFadeOptions = {
  ...transparentModalOptions,
  cardStyleInterpolator: forFade,
}
