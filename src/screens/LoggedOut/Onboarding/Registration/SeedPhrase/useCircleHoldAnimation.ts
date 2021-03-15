import { useRef, useState, useEffect } from 'react'
import { GestureResponderEvent, PanResponder } from 'react-native'
import { useMagicBtnAnimations } from '~/hooks/magicButton'

export enum GestureState {
  None,
  Start,
  End,
  Success,
}

const useCircleHoldAnimation = (animationDuration: number) => {
  const [gestureState, setGestureState] = useState<GestureState>(
    GestureState.None,
  )
  const gestureStateRef = useRef<GestureState>(gestureState)
  const startTime = useRef(0)

  //NOTE: for @onTouchEnd to get the updated @gestureState from the ref
  useEffect(() => {
    gestureStateRef.current = gestureState
    if (gestureState === GestureState.Success) {
      resetShadow.start()
    }
  }, [gestureState])

  const {
    animatedValues: { magicOpacity, shadowScale, circleScale },
    animateValues: { riseShadow, resetShadow, resetMagic, hideMagicBtn },
  } = useMagicBtnAnimations(animationDuration)

  const onTouchStart = (e: GestureResponderEvent) => {
    if (gestureStateRef.current !== GestureState.Success) {
      startTime.current = e.nativeEvent.timestamp
      setGestureState(GestureState.Start)
      riseShadow.start()
    }
  }

  const onTouchEnd = () => {
    if (gestureStateRef.current !== GestureState.Success) {
      setGestureState(GestureState.End)
      resetMagic.start()
    }
  }

  const onTouchMove = (e: GestureResponderEvent) => {
    // NOTE: finishes the gesture with the state @GestureState.Success if
    // the duration of the gesture was equal/longer than the required success duration.
    // Not calculated in @onTouchEnd because the @Success state will be triggered
    // only after the finger was lifted, while here it is triggered continuously
    // while the finger is moved.
    if (
      e.nativeEvent.timestamp - startTime.current >= animationDuration &&
      gestureStateRef.current !== GestureState.Success
    ) {
      setGestureState(GestureState.Success)
    }
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: onTouchStart,
      onPanResponderMove: onTouchMove,
      onPanResponderRelease: onTouchEnd,
    }),
  ).current

  const animationValues = {
    shadowScale,
    circleScale,
    magicOpacity,
  }
  const animateVaues = {
    hideMagicBtn,
  }
  return {
    gestureState,
    animationValues,
    animateVaues,
    gestureHandlers: panResponder.panHandlers,
  }
}

export default useCircleHoldAnimation
