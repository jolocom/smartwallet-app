import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RouteProp, useRoute } from '@react-navigation/core'

import { AusweisProvider } from './context'
import { useAusweisContext } from './hooks'
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
  AusweisProviderDetails,
  AusweisScanner,
} from './components'
import AusweisLockPukInfo from './components/AusweisLockPukInfo'

export type AusweisStackParamList = {
  [eIDScreens.InteractionSheet]: undefined
  [eIDScreens.AusweisScanner]: undefined
  [eIDScreens.ReadinessCheck]: undefined
  [eIDScreens.RequestDetails]: undefined
  [eIDScreens.EnterPIN]: AusweisPasscodeProps
  [eIDScreens.PasscodeDetails]: undefined
  [eIDScreens.ProviderDetails]: undefined
  [eIDScreens.PukLock]: undefined
}
const eIDStack = createStackNavigator<AusweisStackParamList>()

const AusweisInteraction = () => {
  const request =
    useRoute<RouteProp<MainStackParamList, ScreenNames.eId>>().params
  const { setRequest } = useAusweisContext()

  useEffect(() => {
    setRequest(request)
  }, [])

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
        name={eIDScreens.ProviderDetails}
        component={AusweisProviderDetails}
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
      <eIDStack.Screen
        name={eIDScreens.PukLock}
        component={AusweisLockPukInfo}
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
