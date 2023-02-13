import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { PersonalizationInputRequest } from 'react-native-mdl'

import { useToasts } from '~/hooks/toasts'
import PopupMenu, { PopupMenuProps } from '~/screens/LoggedIn/PopupMenu'
import DragToConfirm from '~/screens/Modals/DragToConfirm'
import AusweisCardInfo from '~/screens/Modals/Interaction/eID/components/AusweisCardInfo'
import { AusweisCardInfoParams } from '~/screens/Modals/Interaction/eID/types'
import { PrimitiveAttributeTypes } from '~/types/credentials'
import { IField } from '~/types/props'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import {
  screenDisableGestures,
  screenTransitionFromBottomDisabledGestures,
  screenTransitionSlideFromRight,
  transparentModalFadeOptions,
  transparentModalOptions,
} from '~/utils/screenSettings'
import Registration from '../LoggedOut/Onboarding/Registration'
import DrivingPrivileges from '../Modals/DrivingPrivileges'
import FieldDetails from '../Modals/FieldDetails'
import CredentialForm from '../Modals/Forms/CredentialForm'
import Interaction from '../Modals/Interaction'
import { AusweisMoreInfo } from '../Modals/Interaction/eID/components'
import AusweisChangePin from '../Modals/Interaction/eID/components/AusweisChangePin'
import AusweisServiceInfo from '../Modals/Interaction/eID/components/AusweisServiceInfo'
import PinRecoveryInstructions from '../Modals/PinRecoveryInstructions'
import Recovery from '../Modals/Recovery'
import { DrivingLicenseForm } from './Documents/DrivingLicenseDemo/DrivingLicenseForm'
import { DrivingLicenseShare } from './Documents/DrivingLicenseDemo/DrivingLicenseShare'
import { useDrivingLicense } from './Documents/DrivingLicenseDemo/hooks'
import AddDocumentMenu, { AddDocumentMenuProps } from './AddDocumentMenu'
import MainTabs from './MainTabs'
import About from './Settings/About'
import BackupIdentity from './Settings/BackupIdentity'
import ChangePin from './Settings/ChangePin'
import ContactUs from './Settings/ContactUs'
import ButtonsTest from './Settings/Development/ButtonsTest'
import { CardTest } from './Settings/Development/CardsTest'
import CollapsibleTest from './Settings/Development/CollapsibleTest'
import LoaderTest from './Settings/Development/DevLoaders'
import InputTest from './Settings/Development/InputTest'
import InteractionPasteTest from './Settings/Development/InteractionPasteTest'
import NotificationsTest from './Settings/Development/NotificationsTest'
import PasscodeTest from './Settings/Development/PasscodeTest'
import FAQ from './Settings/FAQ'
import Imprint from './Settings/Imprint'
import Language from './Settings/Language'
import PrivacyPolicy from './Settings/PrivacyPolicy'
import TermsOfService from './Settings/TermsOfService'

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
  [ScreenNames.AusweisServiceInfo]: {
    eIdData: { title: string; fields: IField[] }
    backgroundColor: Colors
  }
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
    id: string
    backgroundColor?: Colors
  }
  [ScreenNames.DrivingPrivileges]: { id: string }
  [ScreenNames.AddDocumentMenu]: AddDocumentMenuProps
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

  // Driving License

  [ScreenNames.DrivingLicenseForm]: { requests: PersonalizationInputRequest[] }
  [ScreenNames.DrivingLicenseShare]: undefined
}

const MainStack = createStackNavigator<MainStackParamList>()

const Main: React.FC = () => {
  const { initDrivingLicense } = useDrivingLicense()
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    initDrivingLicense().catch(scheduleErrorWarning)
  }, [])

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

      {/* Driving License screens */}

      <MainStack.Screen
        options={{ ...transparentModalFadeOptions, ...screenDisableGestures }}
        name={ScreenNames.DrivingLicenseForm}
        component={DrivingLicenseForm}
      />
      <MainStack.Screen
        name={ScreenNames.DrivingLicenseShare}
        component={DrivingLicenseShare}
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
        options={screenTransitionSlideFromRight}
      />
      <MainStack.Screen
        name={ScreenNames.DrivingPrivileges}
        component={DrivingPrivileges}
        options={screenTransitionSlideFromRight}
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
        name={ScreenNames.AusweisServiceInfo}
        component={AusweisServiceInfo}
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
      <MainStack.Screen
        name={ScreenNames.AddDocumentMenu}
        component={AddDocumentMenu}
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
