import React from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'

import { ScreenNames } from '~/types/screens'
import Interaction from '~/screens/Modals/Interaction'
import Language from './Settings/Language'
import ChangePin from './Settings/ChangePin'
import FAQ from './Settings/FAQ'
import ContactUs from './Settings/ContactUs'
import About from './Settings/About'
import Imprint from './Settings/Imprint'
import PrivacyPolicy from './Settings/PrivacyPolicy'
import TermsOfService from './Settings/TermsOfService'
import BackupIdentity from './Settings/BackupIdentity'
import ButtonsTest from './Settings/Development/ButtonsTest'
import NotificationsTest from './Settings/Development/NotificationsTest'
import DragToConfirm from '~/screens/Modals/DragToConfirm'
import LoaderTest from './Settings/Development/DevLoaders'
import InputTest from './Settings/Development/InputTest'
import PasscodeTest from './Settings/Development/PasscodeTest'
import BusinessCardTest from './Settings/Development/BusinessCardTest'
import { shouldShowTermsConsent } from '~/modules/account/selectors'
import TermsConsent from '~/screens/Modals/TermsConsent'
import MainTabs from './MainTabs'

const MainStack = createStackNavigator()

const settingsScreenTransitionOptions = {
  ...Platform.select({
    ios: {
      ...TransitionPresets.SlideFromRightIOS,
    },
    android: {
      ...TransitionPresets.DefaultTransition,
    },
  }),
}

const Main: React.FC = () => {
  const shouldShowConsent = useSelector(shouldShowTermsConsent)
  return (
    <MainStack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={
        shouldShowConsent
          ? ScreenNames.LoggedInTermsConsent
          : ScreenNames.MainTabs
      }
    >
      {shouldShowConsent ? (
        <MainStack.Screen
          name={ScreenNames.LoggedInTermsConsent}
          component={TermsConsent}
          options={settingsScreenTransitionOptions}
        />
      ) : (
        <>
          <MainStack.Screen name={ScreenNames.MainTabs} component={MainTabs} />

          {/* Settings Screens -> Start   */}
          <MainStack.Screen
            name={ScreenNames.Language}
            component={Language}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <MainStack.Screen
            name={ScreenNames.ChangePin}
            component={ChangePin}
            options={settingsScreenTransitionOptions}
          />
          <MainStack.Screen
            name={ScreenNames.BackupIdentity}
            component={BackupIdentity}
            options={settingsScreenTransitionOptions}
          />
          <MainStack.Screen
            name={ScreenNames.FAQ}
            component={FAQ}
            options={settingsScreenTransitionOptions}
          />
          <MainStack.Screen
            name={ScreenNames.ContactUs}
            component={ContactUs}
            options={settingsScreenTransitionOptions}
          />
          <MainStack.Screen
            name={ScreenNames.About}
            component={About}
            options={settingsScreenTransitionOptions}
          />
          <MainStack.Screen
            name={ScreenNames.Imprint}
            component={Imprint}
            options={settingsScreenTransitionOptions}
          />
          <MainStack.Screen
            name={ScreenNames.PrivacyPolicy}
            component={PrivacyPolicy}
            options={settingsScreenTransitionOptions}
          />
          <MainStack.Screen
            name={ScreenNames.TermsOfService}
            component={TermsOfService}
            options={settingsScreenTransitionOptions}
          />
          <MainStack.Screen
            name={ScreenNames.DragToConfirm}
            component={DragToConfirm}
          />

          {__DEV__ && (
            <>
              <MainStack.Screen
                name={ScreenNames.ButtonsTest}
                component={ButtonsTest}
                options={settingsScreenTransitionOptions}
              />
              <MainStack.Screen
                name={ScreenNames.LoaderTest}
                component={LoaderTest}
              />
              <MainStack.Screen
                name={ScreenNames.NotificationsTest}
                component={NotificationsTest}
                options={settingsScreenTransitionOptions}
              />
              <MainStack.Screen
                name={ScreenNames.InputTest}
                component={InputTest}
                options={settingsScreenTransitionOptions}
              />
              <MainStack.Screen
                name={ScreenNames.PasscodeTest}
                component={PasscodeTest}
                options={settingsScreenTransitionOptions}
              />
              <MainStack.Screen
                name={ScreenNames.BusinessCardTest}
                component={BusinessCardTest}
                options={settingsScreenTransitionOptions}
              />
            </>
          )}
          {/* Settings Screens -> End   */}

          {/* Modals -> Start */}
          <MainStack.Screen
            name={ScreenNames.Interaction}
            component={Interaction}
            options={{ gestureEnabled: false }}
          />
          {/* Modals -> End */}
        </>
      )}
    </MainStack.Navigator>
  )
}

export default Main
