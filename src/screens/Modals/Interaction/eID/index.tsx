import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { AusweisProvider } from './context'
import eIDHooks from './hooks'
import {
  AusweisCardResult,
  AusweisPasscodeParams,
  AusweisScannerParams,
  eIDScreens,
} from './types'
import {
  screenTransitionFromBottomDisabledGestures,
  screenTransitionSlideFromRight,
  transparentModalFadeOptions,
  transparentModalOptions,
} from '~/utils/screenSettings'
import {
  AusweisRequestReview,
  AusweisPasscode,
  AusweisPinInfo,
  AusweisScanner,
  AusweisCompatibilityResult,
  AusweisPukInfo,
  AusweisTransportPinInfo,
} from './components'
import AusweisLockPukInfo from './components/AusweisLockPukInfo'
import { AusweisCanInfo } from './components/AusweisCanInfo'
import AusweisTarnsportWarning from './components/AusweisTransportWarning'
import { useDispatch, useSelector } from 'react-redux'
import { getAusweisInteractionDetails } from '~/modules/interaction/selectors'
import { setAusweisInteractionDetails } from '~/modules/interaction/actions'
import AusweisChangePin from './components/AusweisChangePin'
import { ScreenNames } from '~/types/screens'
import { AusweisMoreInfo } from '~/screens/Modals/Interaction/eID/components'

export type AusweisStackParamList = {
  [eIDScreens.AusweisScanner]: AusweisScannerParams
  [eIDScreens.RequestDetails]: undefined
  [eIDScreens.EnterPIN]: AusweisPasscodeParams
  [eIDScreens.PinInfo]: undefined
  [eIDScreens.ProviderDetails]: undefined
  [eIDScreens.PukInfo]: undefined
  [eIDScreens.PukLock]: undefined
  [eIDScreens.CompatibilityResult]: AusweisCardResult
  [eIDScreens.CanInfo]: undefined
  [eIDScreens.AusweisTransportWarning]: undefined
  [eIDScreens.ForgotPin]: undefined
  [eIDScreens.AusweisTransportPinInfo]: undefined
  [eIDScreens.AusweisChangePin]: undefined
  [ScreenNames.AusweisMoreInfo]: undefined
}
const eIDStack = createStackNavigator<AusweisStackParamList>()

const AusweisInteraction = () => {
  const { setRequest } = eIDHooks.useAusweisContext()
  const ausweisDetails = useSelector(getAusweisInteractionDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    if (ausweisDetails) {
      setRequest(ausweisDetails)
      dispatch(setAusweisInteractionDetails(null))
    }
  }, [])

  return (
    <eIDStack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={eIDScreens.RequestDetails}
      screenOptions={transparentModalOptions}
    >
      <eIDStack.Screen
        name={eIDScreens.AusweisScanner}
        component={AusweisScanner}
        options={transparentModalFadeOptions}
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
        name={eIDScreens.PinInfo}
        component={AusweisPinInfo}
        options={screenTransitionFromBottomDisabledGestures}
      />
      <eIDStack.Screen
        name={eIDScreens.PukLock}
        component={AusweisLockPukInfo}
        options={screenTransitionFromBottomDisabledGestures}
      />
      <eIDStack.Screen
        name={eIDScreens.CompatibilityResult}
        component={AusweisCompatibilityResult}
        options={transparentModalFadeOptions}
      />
      <eIDStack.Screen
        name={eIDScreens.CanInfo}
        component={AusweisCanInfo}
        options={screenTransitionSlideFromRight}
      />
      <eIDStack.Screen
        name={eIDScreens.PukInfo}
        component={AusweisPukInfo}
        options={screenTransitionSlideFromRight}
      />
      <eIDStack.Screen
        name={eIDScreens.AusweisTransportWarning}
        component={AusweisTarnsportWarning}
        options={transparentModalFadeOptions}
      />
      <eIDStack.Screen
        name={eIDScreens.AusweisTransportPinInfo}
        component={AusweisTransportPinInfo}
        options={screenTransitionSlideFromRight}
      />
      <eIDStack.Screen
        name={eIDScreens.AusweisChangePin}
        component={AusweisChangePin}
        options={screenTransitionSlideFromRight}
      />
      <eIDStack.Screen
        name={ScreenNames.AusweisMoreInfo}
        component={AusweisMoreInfo}
        options={screenTransitionSlideFromRight}
      />
    </eIDStack.Navigator>
  )
}

export default () => (
  <AusweisProvider>
    <AusweisInteraction />
  </AusweisProvider>
)
