import React from 'react'
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { Platform } from 'react-native'

import { ScreenNames } from '~/types/screens'

import Interaction from '~/screens/Modals/Interaction'

import History from './History'
import Documents from './Documents'

import BottomBar from '~/components/BottomBar'

import Settings from './Settings'
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
import Identity from './Identity'
import FormTest from './Settings/Development/FormTest'
import InputTest from './Settings/Development/InputTest'
import PasscodeTest from './Settings/Development/PasscodeTest'

const MainTabs = createBottomTabNavigator()
const LoggedInStack = createStackNavigator()

const Tabs = () => (
  <MainTabs.Navigator
    tabBar={(props: BottomTabBarProps) => {
      return <BottomBar {...props} />
    }}
  >
    <MainTabs.Screen name={ScreenNames.Identity} component={Identity} />
    <MainTabs.Screen name={ScreenNames.Documents} component={Documents} />
    <MainTabs.Screen name={ScreenNames.History} component={History} />
    <MainTabs.Screen name={ScreenNames.Settings} component={Settings} />
  </MainTabs.Navigator>
)

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

const LoggedInTabs: React.FC = () => {
    return (
    <LoggedInStack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={ScreenNames.Tabs}
    >
      <LoggedInStack.Screen name={ScreenNames.Tabs} component={Tabs} />

      {/* Settings Screens -> Start   */}
      <LoggedInStack.Screen
        name={ScreenNames.Language}
        component={Language}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <LoggedInStack.Screen
        name={ScreenNames.ChangePin}
        component={ChangePin}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.BackupIdentity}
        component={BackupIdentity}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.FAQ}
        component={FAQ}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.ContactUs}
        component={ContactUs}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.About}
        component={About}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.Imprint}
        component={Imprint}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.PrivacyPolicy}
        component={PrivacyPolicy}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.TermsOfService}
        component={TermsOfService}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.DragToConfirm}
        component={DragToConfirm}
      />

      {__DEV__ && (
        <>
          <LoggedInStack.Screen
            name={ScreenNames.ButtonsTest}
            component={ButtonsTest}
            options={settingsScreenTransitionOptions}
          />
          <LoggedInStack.Screen
            name={ScreenNames.LoaderTest}
            component={LoaderTest}
          />
          <LoggedInStack.Screen
            name={ScreenNames.NotificationsTest}
            component={NotificationsTest}
            options={settingsScreenTransitionOptions}
          />
          <LoggedInStack.Screen
            name={ScreenNames.FormTest}
            component={FormTest}
            options={settingsScreenTransitionOptions}
          />
          <LoggedInStack.Screen
            name={ScreenNames.InputTest}
            component={InputTest}
            options={settingsScreenTransitionOptions}
          />
          <LoggedInStack.Screen
            name={ScreenNames.PasscodeTest}
            component={PasscodeTest}
            options={settingsScreenTransitionOptions}
          />
        </>
      )}
      {/* Settings Screens -> End   */}

      {/* Modals -> Start */}
      <LoggedInStack.Screen
        name={ScreenNames.Camera}
        component={Interaction}
        options={{gestureEnabled: false}}
      />
      {/* Modals -> End */}
        </LoggedInStack.Navigator>
  )
}

export default LoggedInTabs
