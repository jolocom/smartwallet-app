import { StackNavigationOptions, TransitionPresets } from "@react-navigation/stack";

export const screenTransitionOptions = {
  ...TransitionPresets.SlideFromRightIOS,
}

const modalScreenTransitionOptions = TransitionPresets.ModalSlideFromBottomIOS;
export const screenTransitionDisableGesture = {...modalScreenTransitionOptions, gestureEnabled: false}

export const transparentModalOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.5, 0.7, 0.8],

      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.8],
        extrapolate: 'clamp',
      }),
    },
  }),
}