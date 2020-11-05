import { Interaction, FlowType } from '@jolocom/sdk'
import { ThunkAction } from 'src/store'

import * as accountActions from 'src/actions/account/'
import * as registrationActions from 'src/actions/registration/'
import * as navigationActions from 'src/actions/navigation/'
import * as genericActions from 'src/actions/generic/'
import * as ssoActions from 'src/actions/sso/'
import * as recoveryActions from 'src/actions/recovery'
import * as notificationsActions from 'src/actions/notifications'

export {
  accountActions,
  registrationActions,
  navigationActions,
  genericActions,
  ssoActions,
  recoveryActions,
  notificationsActions,
}

export const interactionHandlers: {
  [flowType: string]: (interxn: Interaction) => ThunkAction
} = {
  [FlowType.Authentication]: ssoActions.consumeAuthenticationRequest,
  [FlowType.CredentialOffer]: ssoActions.consumeCredentialOfferRequest,
  [FlowType.CredentialShare]: ssoActions.consumeCredentialRequest,
  [FlowType.EstablishChannel]: ssoActions.consumeEstablishChannelRequest,
  [FlowType.Resolution]: ssoActions.consumeResolutionRequest,
}
