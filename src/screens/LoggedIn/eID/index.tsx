import React, { useCallback, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useBackHandler } from '@react-native-community/hooks'

import { AusweisProvider } from './context'
import { useAusweisContext, useAusweisInteraction } from './hooks'
import {
  AusweisCardResult,
  AusweisPasscodeProps,
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
} from './components'
import AusweisLockPukInfo from './components/AusweisLockPukInfo'
import AusweisTarnsportWarning from './components/AusweisTransportWarning'
import { useDispatch, useSelector } from 'react-redux'
import { getAusweisInteractionDetails } from '~/modules/ausweis/selectors'
import { setAusweisInteractionDetails } from '~/modules/ausweis/actions'

export type AusweisStackParamList = {
  [eIDScreens.InteractionSheet]: undefined
  [eIDScreens.AusweisScanner]: AusweisScannerParams
  [eIDScreens.ReadinessCheck]: undefined
  [eIDScreens.RequestDetails]: undefined
  [eIDScreens.EnterPIN]: AusweisPasscodeProps
  [eIDScreens.PasscodeDetails]: undefined
  [eIDScreens.ProviderDetails]: undefined
  [eIDScreens.PukInfo]: undefined
  [eIDScreens.PukLock]: undefined
  [eIDScreens.CompatibilityResult]: AusweisCardResult
  [eIDScreens.AusweisTransportWarning]: undefined
}
const eIDStack = createStackNavigator<AusweisStackParamList>()

const AusweisInteraction = () => {
  const { setRequest } = useAusweisContext()
  const { cancelInteraction } = useAusweisInteraction()
  const ausweisDetails = useSelector(getAusweisInteractionDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    if (ausweisDetails) {
      setRequest(ausweisDetails)
      dispatch(setAusweisInteractionDetails(null))
    } else {
      throw new Error(
        "ERROR: You shouldn't navigate to AusweisInteraction without dispatching the details to the state",
      )
    }
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
        name={eIDScreens.PukInfo}
        component={AusweisPukInfo}
        options={transparentModalFadeOptions}
      />
      <eIDStack.Screen
        name={eIDScreens.AusweisTransportWarning}
        component={AusweisTarnsportWarning}
        options={transparentModalFadeOptions}
      />
    </eIDStack.Navigator>
  )
}

export default () => (
  <AusweisProvider>
    <AusweisInteraction />
  </AusweisProvider>
)
