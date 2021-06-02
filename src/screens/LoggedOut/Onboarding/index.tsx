import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Recovery from '~/screens/Modals/Recovery'
import TermsConsent from '~/screens/Modals/TermsConsent'
import { useSelector } from 'react-redux'
import { shouldShowTermsConsent } from '~/modules/account/selectors'
import Registration from './Registration'
import { LoggedOutParamList } from '../types'
import { useRoute, RouteProp } from '@react-navigation/native'

const Stack = createStackNavigator()

const Onboarding: React.FC<LoggedOutParamList[ScreenNames.Onboarding]> = () => {
  const shouldShowTerms = useSelector(shouldShowTermsConsent)
  const route =
    useRoute<RouteProp<LoggedOutParamList, ScreenNames.Onboarding>>()
  const { initialRoute } = route.params

  return (
    <Stack.Navigator headerMode="none">
      {shouldShowTerms ? (
        <Stack.Screen
          name={ScreenNames.LoggedOutTermsConsent}
          component={TermsConsent}
        />
      ) : initialRoute === ScreenNames.Registration ? (
        <Stack.Screen
          name={ScreenNames.Registration}
          component={Registration}
        />
      ) : (
        <Stack.Screen
          name={ScreenNames.IdentityRecovery}
          component={Recovery}
        />
      )}
    </Stack.Navigator>
  )
}

export default Onboarding
