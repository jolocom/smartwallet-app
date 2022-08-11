import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
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
import MainTabs from './MainTabs'
import CredentialForm from '../Modals/Forms/CredentialForm'
import { PrimitiveAttributeTypes } from '~/types/credentials'
import FieldDetails from '../Modals/FieldDetails'
import PinRecoveryInstructions from '../Modals/PinRecoveryInstructions'
import Recovery from '../Modals/Recovery'
import {
  screenTransitionFromBottomDisabledGestures,
  screenTransitionSlideFromBottom,
  screenTransitionSlideFromRight,
  transparentModalOptions,
  screenDisableGestures,
  transparentModalFadeOptions,
} from '~/utils/screenSettings'
import PopupMenu, { PopupMenuProps } from '~/screens/LoggedIn/PopupMenu'
import InteractionPasteTest from './Settings/Development/InteractionPasteTest'
import CollapsibleTest from './Settings/Development/CollapsibleTest'
import { AusweisCardInfoParams } from '~/screens/Modals/Interaction/eID/types'
import { Colors } from '~/utils/colors'
import AusweisCardInfo from '~/screens/Modals/Interaction/eID/components/AusweisCardInfo'
import Registration from '../LoggedOut/Onboarding/Registration'
import Interaction from '../Modals/Interaction'
import AusweisChangePin from '../Modals/Interaction/eID/components/AusweisChangePin'
import { AusweisMoreInfo } from '../Modals/Interaction/eID/components'
import { CardTest } from './Settings/Development/CardsTest'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

export type TransparentModalsParamsList = {
  [ScreenNames.PopupMenu]: PopupMenuProps
  [ScreenNames.AusweisCardInfo]: AusweisCardInfoParams
}
const TransparentModalsStack = createStackNavigator()

const TransparentModals = () => (
  <TransparentModalsStack.Navigator
    headerMode="none"
    mode="modal"
    screenOptions={transparentModalOptions}
  >
    <TransparentModalsStack.Screen
      name={ScreenNames.PopupMenu}
      component={PopupMenu}
    />
    <TransparentModalsStack.Screen
      name={ScreenNames.AusweisCardInfo}
      component={AusweisCardInfo}
    />
  </TransparentModalsStack.Navigator>
)

export type MainStackParamList = {
  [ScreenNames.Interaction]: undefined
  [ScreenNames.AusweisChangePin]: undefined
  [ScreenNames.AusweisMoreInfo]: undefined
  [ScreenNames.MainTabs]: undefined
  [ScreenNames.Language]: undefined
  [ScreenNames.MnemonicPhrase]: undefined
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
  [ScreenNames.FieldDetails]: {
    fields: DisplayVal[]
    title?: string
    photo?: string
    backgroundColor?: Colors
    issuerIcon?: string
    contextIcons?: string[]
  }
  // DEV
  [ScreenNames.CardsTest]: undefined
  [ScreenNames.InteractionPasteTest]: undefined
  [ScreenNames.ButtonsTest]: undefined
  [ScreenNames.CollapsibleTest]: undefined
  [ScreenNames.LoaderTest]: undefined
  [ScreenNames.NotificationsTest]: undefined
  [ScreenNames.InputTest]: undefined
  [ScreenNames.PasscodeTest]: undefined
  [ScreenNames.PinRecoveryInstructions]: undefined
  [ScreenNames.PasscodeRecovery]: {
    isAccessRestore: boolean
  }
  [ScreenNames.TransparentModals]: undefined
}

const MainStack = createStackNavigator<MainStackParamList>()

const Main: React.FC = () => {
  return (
    <MainStack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={ScreenNames.MainTabs}
    >
      <MainStack.Screen name={ScreenNames.MainTabs} component={MainTabs} />
      {/* Settings Screens -> Start   */}
      <MainStack.Screen
        name={ScreenNames.Language}
        component={Language}
        options={screenTransitionSlideFromRight}
      />
      <MainStack.Screen
        name={ScreenNames.MnemonicPhrase}
        component={Registration}
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
            component={CollapsibleTest}
            options={screenTransitionSlideFromRight}
          />
          <MainStack.Screen
            name={ScreenNames.LoaderTest}
            component={LoaderTest}
          />
          <MainStack.Screen name={ScreenNames.CardsTest} component={CardTest} />
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
        </>
      )}
      {/* Settings Screens -> End   */}

      {/* Modals -> Start */}
      <MainStack.Screen
        name={ScreenNames.FieldDetails}
        component={FieldDetails}
        options={screenTransitionSlideFromBottom}
      />
      <MainStack.Screen
        name={ScreenNames.Interaction}
        component={Interaction}
        options={{
          ...screenDisableGestures,
          ...transparentModalFadeOptions,
        }}
      />
      <MainStack.Screen
        name={ScreenNames.AusweisChangePin}
        component={AusweisChangePin}
        options={screenTransitionSlideFromRight}
      />
      <MainStack.Screen
        name={ScreenNames.AusweisMoreInfo}
        component={AusweisMoreInfo}
        options={screenTransitionSlideFromRight}
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
          ...transparentModalFadeOptions,
        }}
      />
      {/* Modals -> End */}
    </MainStack.Navigator>
  )
}

export default Main
