import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { transparentModalOptions } from '../../utils/screenSettings'
import { ScreenNames } from '~/types/screens'
import LostSeedPhraseInfo from '../Modals/LostSeedPhraseInfo'
import AppDisabled from '../Modals/AppDisabled'

const ModalStack = createStackNavigator()

const GlobalModals = () => {
  return (
    <ModalStack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={transparentModalOptions}
    >
      <ModalStack.Screen
        name={ScreenNames.LostSeedPhraseInfo}
        component={LostSeedPhraseInfo}
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
