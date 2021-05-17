import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ScreenNames } from '~/types/screens'
import Lock from '../Modals/Lock'
import PinRecoveryInstructions from '../Modals/PinRecoveryInstructions'
import Recovery from '../Modals/Recovery'
import { screenTransitionDisableGesture } from '~/utils/screenSettings'

export type LockStackParamList = {
  [ScreenNames.PasscodeRecovery]: {
    isAccessRestore: boolean
  }
  [ScreenNames.Lock]: undefined
  [ScreenNames.PinRecoveryInstructions]: undefined
}

const LockStackNavigator = createStackNavigator<LockStackParamList>()

const LockStack = () => {
  return (
    <LockStackNavigator.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Lock}
    >
      <LockStackNavigator.Screen
        name={ScreenNames.Lock}
        component={Lock}
        options={screenTransitionDisableGesture}
      />

      <LockStackNavigator.Screen
        name={ScreenNames.PinRecoveryInstructions}
        component={PinRecoveryInstructions}
        options={screenTransitionDisableGesture}
      />
      <LockStackNavigator.Screen
        name={ScreenNames.PasscodeRecovery}
        component={Recovery}
        options={screenTransitionDisableGesture}
      />
    </LockStackNavigator.Navigator>
  )
}

export default LockStack
