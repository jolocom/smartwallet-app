import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MainContent from './MainContent'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'
import { ScreenNames } from '~/types/screens'

const TermsConsentStack = createStackNavigator()

const TermsConsent: React.FC = () => {
  return (
    <TermsConsentStack.Navigator headerMode="none">
      <TermsConsentStack.Screen
        name={ScreenNames.TermsConsentStack}
        component={MainContent}
      />
      <TermsConsentStack.Screen
        name={ScreenNames.ConsentPrivacyPolicy}
        component={PrivacyPolicy}
      />
      <TermsConsentStack.Screen
        name={ScreenNames.ConsentTermsOfService}
        component={TermsOfService}
      />
    </TermsConsentStack.Navigator>
  )
}

export default TermsConsent
