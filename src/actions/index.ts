import { Interaction, FlowType } from '@jolocom/sdk'
import { ThunkAction } from 'src/store'

import * as accountActions from 'src/actions/account/'
import * as registrationActions from 'src/actions/registration/'
import * as navigationActions from 'src/actions/navigation/'
import * as genericActions from 'src/actions/generic/'
import * as ssoActions from 'src/actions/sso/'
import * as recoveryActions from 'src/actions/recovery'
import * as notificationsActions from 'src/actions/notifications'
import strings from 'src/locales/strings'
import I18n from 'src/locales/i18n'
import { createInfoNotification } from '../lib/notifications'

export {
  accountActions,
  registrationActions,
  navigationActions,
  genericActions,
  ssoActions,
  recoveryActions,
  notificationsActions,
}

export const scheduleOfflineNotification: ThunkAction = dispatch =>
  dispatch(
    notificationsActions.scheduleNotification(
      createInfoNotification({
        title: I18n.t(strings.UH_OH_YOURE_NOT_CONNECTED),
        message: I18n.t(
          strings.WE_CANT_REGISTER_YOU_IF_YOU_DONT_HAVE_INTERNET_PLEASE_CHECK_YOUR_CONNECTION_AND_TRY_AGAIN,
        ),
      }),
    ),
  )

export const interactionHandlers: {
  [flowType: string]: (interxn: Interaction) => ThunkAction
} = {
  [FlowType.Authentication]: ssoActions.consumeAuthenticationRequest,
  [FlowType.CredentialOffer]: ssoActions.consumeCredentialOfferRequest,
  [FlowType.CredentialShare]: ssoActions.consumeCredentialRequest,
  [FlowType.EstablishChannel]: ssoActions.consumeEstablishChannelRequest,
  [FlowType.Resolution]: ssoActions.consumeResolutionRequest,
}
