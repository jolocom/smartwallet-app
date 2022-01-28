import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Recovery from '~/screens/Modals/Recovery'
import TermsConsent from '~/screens/Modals/TermsConsent'
import { useSelector } from 'react-redux'
import { shouldShowTermsConsent } from '~/modules/account/selectors'

const Stack = createStackNavigator()

const Onboarding: React.FC = () => {
  const shouldShowTerms = useSelector(shouldShowTermsConsent)

  return (
    <Stack.Navigator headerMode="none">
      {shouldShowTerms ? (
        <Stack.Screen
          name={ScreenNames.LoggedOutTermsConsent}
          component={TermsConsent}
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
