import { TransitionPresets } from "@react-navigation/stack";

export const screenTransitionOptions = {
  ...TransitionPresets.SlideFromRightIOS,
}

const modalScreenTransitionOptions = TransitionPresets.ModalSlideFromBottomIOS;
export const screenTransitionDisableGesture = {...modalScreenTransitionOptions, gestureEnabled: false}