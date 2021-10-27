import React, { useCallback, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RouteProp, useRoute } from '@react-navigation/core'
import { useBackHandler } from '@react-native-community/hooks'

import { AusweisProvider } from './context'
import { useAusweisContext, useAusweisInteraction } from './hooks'
import { MainStackParamList } from '../Main'
import { ScreenNames } from '~/types/screens'
import {
  screenTransitionFromBottomDisabledGestures,
  transparentModalFadeOptions,
  transparentModalOptions,
} from '~/utils/screenSettings'
import { AusweisPasscodeProps, eIDScreens } from './types'
import {
  AusweisRequestReview,
  AusweisRequest,
  CompatibilityCheck,
  AusweisPasscode,
  AusweisPasscodeDetails,
  AusweisScanner,
} from './components'

export type AusweisStackParamList = {
  [eIDScreens.InteractionSheet]: undefined
  [eIDScreens.AusweisScanner]: {
    onDismiss?: () => void
  }
  [eIDScreens.ReadinessCheck]: undefined
  [eIDScreens.RequestDetails]: undefined
  [eIDScreens.EnterPIN]: AusweisPasscodeProps
  [eIDScreens.PasscodeDetails]: undefined
}
const eIDStack = createStackNavigator<AusweisStackParamList>()

const AusweisInteraction = () => {
  const request =
    useRoute<RouteProp<MainStackParamList, ScreenNames.eId>>().params
  const { setRequest } = useAusweisContext()
  const { cancelInteraction } = useAusweisInteraction()

  useEffect(() => {
    setRequest(request)
  }, [])

  const cancel = useCallback(() => {
    cancelInteraction()
    return true
  }, [])

  useBackHandler(cancel)

  return (
    <eIDStack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={eIDScreens.InteractionSheet}
      screenOptions={transparentModalOptions}
    >
      <eIDStack.Screen
        name={eIDScreens.InteractionSheet}
        component={AusweisRequest}
      />
      <eIDStack.Screen
        name={eIDScreens.AusweisScanner}
        component={AusweisScanner}
        options={transparentModalFadeOptions}
      />
      <eIDStack.Screen
        name={eIDScreens.ReadinessCheck}
        component={CompatibilityCheck}
        options={screenTransitionFromBottomDisabledGestures}
      />
      <eIDStack.Screen
        name={eIDScreens.RequestDetails}
        component={AusweisRequestReview}
        options={screenTransitionFromBottomDisabledGestures}
      />
      <eIDStack.Screen
        name={eIDScreens.EnterPIN}
        component={AusweisPasscode}
        options={screenTransitionFromBottomDisabledGestures}
      />
      <eIDStack.Screen
        name={eIDScreens.PasscodeDetails}
        component={AusweisPasscodeDetails}
        options={screenTransitionFromBottomDisabledGestures}
      />
    </eIDStack.Navigator>
  )
}

export default () => (
  <AusweisProvider>
    <AusweisInteraction />
  </AusweisProvider>
)
