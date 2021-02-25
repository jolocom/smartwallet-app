import { ScreenNames } from '~/types/screens'

export type OnboardingStackScreens =
  | ScreenNames.Registration
  | ScreenNames.IdentityRecovery

export type LoggedOutParamList = {
  [ScreenNames.Walkthrough]: undefined
  [ScreenNames.Onboarding]: {
    initialRoute: OnboardingStackScreens
  }
}
