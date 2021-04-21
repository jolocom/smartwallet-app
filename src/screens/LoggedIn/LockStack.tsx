import React from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { ScreenNames } from '~/types/screens'
import Lock from '../Modals/Lock'
import PinRecoveryInstructions from '../Modals/PinRecoveryInstructions'
import Recovery from '../Modals/Recovery'

export type LockStackParamList = {
  [ScreenNames.PasscodeRecovery]: {
    isAccessRestore: boolean
  }
  [ScreenNames.Lock]: undefined
  [ScreenNames.PinRecoveryInstructions]: undefined
}

const LockStackNavigator = createStackNavigator<LockStackParamList>()

const screenTransitionOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
}

const LockStack = () => {
  return (
    <LockStackNavigator.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Lock}
    >
      <LockStackNavigator.Screen
        name={ScreenNames.Lock}
        component={Lock}
        options={{
          ...screenTransitionOptions,
          gestureEnabled: false,
        }}
      />

      <LockStackNavigator.Screen
        name={ScreenNames.PinRecoveryInstructions}
        component={PinRecoveryInstructions}
        options={{ ...screenTransitionOptions, gestureEnabled: false }}
      />
      <LockStackNavigator.Screen
        name={ScreenNames.PasscodeRecovery}
        component={Recovery}
        options={{ ...screenTransitionOptions, gestureEnabled: false }}
      />
    </LockStackNavigator.Navigator>
  )
}

export default LockStack
