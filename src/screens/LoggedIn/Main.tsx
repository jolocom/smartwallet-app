import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
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
import { shouldShowTermsConsent } from '~/modules/account/selectors'
import TermsConsent from '~/screens/Modals/TermsConsent'
import MainTabs from './MainTabs'
import CredentialForm from '../Modals/Forms/CredentialForm'
import { PrimitiveAttributeTypes } from '~/types/credentials'
import { IField } from '~/components/Card/types'
import CredentialDetails from './Documents/CredentialDetails'
import InteractionTest from './Settings/Development/InteractionCardsTest'
import PinRecoveryInstructions from '../Modals/PinRecoveryInstructions'
import Recovery from '../Modals/Recovery'
import {
  screenTransitionFromBottomDisabledGestures,
  screenTransitionSlideFromBottom,
  screenTransitionSlideFromRight,
  transparentModalOptions,
} from '~/utils/screenSettings'
import PopupMenu, { PopupMenuProps } from '~/components/PopupMenu'
import CollapsibleClone from './Settings/Development/CollapsibleClone'
import InteractionPasteTest from './Settings/Development/InteractionPasteTest'

export type TransparentModalsParamsList = {
  [ScreenNames.PopupMenu]: PopupMenuProps
}
const TransparentModalsStack = createStackNavigator()

const TransparentModals = () => {
  return (
    <TransparentModalsStack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={transparentModalOptions}
    >
      <TransparentModalsStack.Screen
        name={ScreenNames.PopupMenu}
        component={PopupMenu}
      />
    </TransparentModalsStack.Navigator>
  )
}

export type MainStackParamList = {
  [ScreenNames.Interaction]: {
    isScannerShown: true
  }
  [ScreenNames.LoggedInTermsConsent]: undefined
  [ScreenNames.MainTabs]: undefined
  [ScreenNames.Language]: undefined
  [ScreenNames.ChangePin]: undefined
  [ScreenNames.BackupIdentity]: undefined
  [ScreenNames.FAQ]: undefined
  [ScreenNames.ContactUs]: undefined
  [ScreenNames.About]: undefined
  [ScreenNames.Imprint]: undefined
  [ScreenNames.PrivacyPolicy]: undefined
  [ScreenNames.TermsOfService]: undefined
  [ScreenNames.DragToConfirm]: undefined
  [ScreenNames.CredentialForm]: { type: PrimitiveAttributeTypes; id?: string }
  [ScreenNames.CredentialDetails]: {
    fields: IField[]
    title?: string
    photo?: string
  }
  // DEV
  [ScreenNames.InteractionPasteTest]: undefined
  [ScreenNames.ButtonsTest]: undefined
  [ScreenNames.CollapsibleTest]: undefined
  [ScreenNames.LoaderTest]: undefined
  [ScreenNames.NotificationsTest]: undefined
  [ScreenNames.InputTest]: undefined
  [ScreenNames.PasscodeTest]: undefined
  [ScreenNames.InteractionCardsTest]: undefined
  [ScreenNames.PinRecoveryInstructions]: undefined
  [ScreenNames.PasscodeRecovery]: {
    isAccessRestore: boolean
  }
  [ScreenNames.TransparentModals]: undefined
}

const MainStack = createStackNavigator<MainStackParamList>()

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
          options={screenTransitionSlideFromRight}
        />
      ) : (
        <>
          <MainStack.Screen name={ScreenNames.MainTabs} component={MainTabs} />

          {/* Settings Screens -> Start   */}
          <MainStack.Screen
            name={ScreenNames.Language}
            component={Language}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.ChangePin}
            component={ChangePin}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.BackupIdentity}
            component={BackupIdentity}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.FAQ}
            component={FAQ}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.ContactUs}
            component={ContactUs}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.About}
            component={About}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.Imprint}
            component={Imprint}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.PrivacyPolicy}
            component={PrivacyPolicy}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.TermsOfService}
            component={TermsOfService}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.DragToConfirm}
            component={DragToConfirm}
          />

          {__DEV__ && (
            <>
              <MainStack.Screen
                name={ScreenNames.InteractionPasteTest}
                component={InteractionPasteTest}
                options={screenTransitionSlideFromRight}
              />
              <MainStack.Screen
                name={ScreenNames.ButtonsTest}
                component={ButtonsTest}
                options={screenTransitionSlideFromRight}
              />
              <MainStack.Screen
                name={ScreenNames.CollapsibleTest}
                component={CollapsibleClone}
                options={screenTransitionSlideFromRight}
              />
              <MainStack.Screen
                name={ScreenNames.LoaderTest}
                component={LoaderTest}
              />
              <MainStack.Screen
                name={ScreenNames.NotificationsTest}
                component={NotificationsTest}
                options={screenTransitionSlideFromRight}
              />
              <MainStack.Screen
                name={ScreenNames.InputTest}
                component={InputTest}
                options={screenTransitionSlideFromRight}
              />
              <MainStack.Screen
                name={ScreenNames.PasscodeTest}
                component={PasscodeTest}
                options={screenTransitionSlideFromRight}
              />
              <MainStack.Screen
                name={ScreenNames.InteractionCardsTest}
                component={InteractionTest}
                options={screenTransitionSlideFromRight}
              />
            </>
          )}
          {/* Settings Screens -> End   */}

          {/* Modals -> Start */}
          <MainStack.Screen
            name={ScreenNames.Interaction}
            component={Interaction}
            options={screenTransitionFromBottomDisabledGestures}
          />
          <MainStack.Screen
            name={ScreenNames.CredentialDetails}
            component={CredentialDetails}
            options={screenTransitionFromBottomDisabledGestures}
          />
          <MainStack.Screen
            name={ScreenNames.CredentialForm}
            component={CredentialForm}
            options={screenTransitionFromBottomDisabledGestures}
          />

          {/* START NOTE: Duplicate Screens from LockStack, so they're available in @ChangePin */}
          <MainStack.Screen
            name={ScreenNames.PinRecoveryInstructions}
            component={PinRecoveryInstructions}
            options={screenTransitionFromBottomDisabledGestures}
          />
          <MainStack.Screen
            name={ScreenNames.PasscodeRecovery}
            component={Recovery}
            options={screenTransitionFromBottomDisabledGestures}
          />
          {/* END NOTE: Duplicate Screens from LockStack, so they're available in @ChangePin */}

          <MainStack.Screen
            name={ScreenNames.TransparentModals}
            component={TransparentModals}
            options={{
              cardStyle: {
                backgroundColor: 'transparent',
              },
              ...screenTransitionSlideFromBottom,
            }}
          />
          {/* Modals -> End */}
        </>
      )}
    </MainStack.Navigator>
  )
}

export default Main
