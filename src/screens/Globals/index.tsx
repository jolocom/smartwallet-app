import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { transparentModalOptions } from '../../utils/screenSettings'
import { ScreenNames } from '~/types/screens'
import LostSeedPhraseInfo from './LostSeedPhraseInfo'
import AppDisabled from './AppDisabled'
import TermsConsent from './TermsConsent'

export type GlobalModalsParamsList = {
  [ScreenNames.LostSeedPhraseInfo]: undefined
  [ScreenNames.SeedPhraseInfo]: undefined
  [ScreenNames.AppDisabled]: {
    attemptCyclesLeft: number
    countdown: number
  }
  [ScreenNames.TermsConsentStack]: undefined
}
const ModalStack = createStackNavigator<GlobalModalsParamsList>()

const GlobalModals = () => {
  return (
    <ModalStack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={transparentModalOptions}
    >
      <ModalStack.Screen
        name={ScreenNames.TermsConsentStack}
        component={TermsConsent}
      />
      <ModalStack.Screen
        name={ScreenNames.LostSeedPhraseInfo}
        component={LostSeedPhraseInfo}
      />
      <ModalStack.Screen
        name={ScreenNames.AppDisabled}
        component={AppDisabled}
      />
    </ModalStack.Navigator>
  )
}

export default GlobalModals
