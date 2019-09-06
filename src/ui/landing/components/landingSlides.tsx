import React, { ReactNode } from 'react'
import { Landing00, Landing01, Landing02, Landing03 } from 'src/resources'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'

export interface Slide {
  bgImage: ReactNode
  title: string
  infoText: string
}

export const landingSlides: Slide[] = [
  {
    bgImage: <Landing00 />,
    title: I18n.t(strings.YOUR_JOLOCOM_WALLET),
    infoText:
      I18n.t(
        strings.TAKE_BACK_CONTROL_OF_YOUR_DIGITAL_SELF_AND_PROTECT_YOUR_PRIVATE_DATA_AGAINST_UNFAIR_USAGE,
      ) + '.',
  },
  {
    bgImage: <Landing01 />,
    title: I18n.t(strings.ITS_EASY),
    infoText:
      I18n.t(strings.FORGET_ABOUT_LONG_FORMS_AND_REGISTRATIONS) +
      '. ' +
      I18n.t(
        strings.INSTANTLY_ACCESS_SERVICES_WITHOUT_USING_YOUR_SOCIAL_MEDIA_PROFILES,
      ) +
      '.',
  },
  {
    bgImage: <Landing03 />,
    title: I18n.t(strings.ENHANCED_PRIVACY),
    infoText:
      I18n.t(strings.SHARE_ONLY_THE_INFORMATION_A_SERVICE_REALLY_NEEDS) +
      '. ' +
      I18n.t(strings.PROTECT_YOUR_DIGITAL_SELF_AGAINST_FRAUD) +
      '.',
  },
  {
    bgImage: <Landing02 />,
    title: I18n.t(strings.GREATER_CONTROL),
    infoText:
      I18n.t(
        strings.KEEP_ALL_YOUR_DATA_WITH_YOU_IN_ONE_PLACE_AVAILABLE_AT_ANY_TIME,
      ) +
      '. ' +
      I18n.t(strings.TRACK_WHERE_YOU_SIGN_IN_TO_SERVICES) +
      '.',
  },
]
