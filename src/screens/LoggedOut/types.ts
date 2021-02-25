import { ScreenNames } from '~/types/screens'

export type RegistrationStackScreen =
  | ScreenNames.Registration
  | ScreenNames.IdentityRecovery

export type LoggedOutParamList = {
  [ScreenNames.Walkthrough]: undefined
  [ScreenNames.Onboarding]: {
    initialRoute: RegistrationStackScreen
  }
}
