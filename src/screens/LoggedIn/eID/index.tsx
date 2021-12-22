import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useBackHandler } from '@react-native-community/hooks'

import { AusweisProvider } from './context'
import { useAusweisContext } from './hooks'
import {
  AusweisCardResult,
  AusweisPasscodeDetailsParams,
  AusweisPasscodeParams,
  AusweisScannerParams,
  eIDScreens,
} from './types'
import {
  screenTransitionFromBottomDisabledGestures,
  transparentModalFadeOptions,
  transparentModalOptions,
} from '~/utils/screenSettings'
import {
  AusweisRequestReview,
  AusweisRequest,
  CompatibilityCheck,
  AusweisPasscode,
  AusweisPasscodeDetails,
  AusweisScanner,
  AusweisCompatibilityResult,
  AusweisPukInfo,
  AusweisTransportPinInfo,
} from './components'
import AusweisLockPukInfo from './components/AusweisLockPukInfo'
import { AusweisCanInfo } from './components/AusweisCanInfo'
import AusweisTarnsportWarning from './components/AusweisTransportWarning'
import { AusweisForgotPin } from './components/AusweisForgotPin'
import { useDispatch, useSelector } from 'react-redux'
import { getAusweisInteractionDetails } from '~/modules/ausweis/selectors'
import { setAusweisInteractionDetails } from '~/modules/ausweis/actions'
import AusweisChangePin from './components/AusweisChangePin'

export type AusweisStackParamList = {
  [eIDScreens.InteractionSheet]: undefined
  [eIDScreens.AusweisScanner]: AusweisScannerParams
  [eIDScreens.ReadinessCheck]: undefined
  [eIDScreens.RequestDetails]: undefined
  [eIDScreens.EnterPIN]: AusweisPasscodeParams
  [eIDScreens.PasscodeDetails]: AusweisPasscodeDetailsParams
  [eIDScreens.ProviderDetails]: undefined
  [eIDScreens.PukInfo]: undefined
  [eIDScreens.PukLock]: undefined
  [eIDScreens.CompatibilityResult]: AusweisCardResult
  [eIDScreens.CanInfo]: undefined
  [eIDScreens.AusweisTransportWarning]: undefined
  [eIDScreens.ForgotPin]: undefined
  [eIDScreens.AusweisTransportPinInfo]: undefined
  [eIDScreens.AusweisChangePin]: undefined
}
const eIDStack = createStackNavigator<AusweisStackParamList>()

const AusweisInteraction = () => {
  const { setRequest } = useAusweisContext()
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
      <eIDStack.Screen name={eIDScreens.CanInfo} component={AusweisCanInfo} />
      <eIDStack.Screen
        name={eIDScreens.ForgotPin}
        component={AusweisForgotPin}
      />
      <eIDStack.Screen
        name={eIDScreens.PukInfo}
        component={AusweisPukInfo}
        options={transparentModalFadeOptions}
      />
      <eIDStack.Screen
        name={eIDScreens.AusweisTransportWarning}
        component={AusweisTarnsportWarning}
        options={transparentModalFadeOptions}
      />
      <eIDStack.Screen
        name={eIDScreens.AusweisTransportPinInfo}
        component={AusweisTransportPinInfo}
      />
      <eIDStack.Screen
        name={eIDScreens.AusweisChangePin}
        component={AusweisChangePin}
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
