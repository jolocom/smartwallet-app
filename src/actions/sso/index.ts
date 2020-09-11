import { navigationActions } from 'src/actions'
import { ThunkAction } from '../../store'
import { scheduleNotification } from '../notifications'
import { createInfoNotification } from 'src/lib/notifications'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'

export {
  consumeAuthenticationRequest,
  sendAuthenticationResponse,
} from './authenticationRequest'

export {
  consumeCredentialOfferRequest,
  consumeCredentialReceive,
  validateSelectionAndSave,
} from './credentialOffer'

export {
  consumeCredentialRequest,
  sendCredentialResponse,
} from './credentialRequest'

export {
  consumeEstablishChannelRequest,
  startChannel,
} from './establishChannel'

export { consumeResolutionRequest } from './resolution'

export const cancelSSO: ThunkAction = dispatch => {
  return dispatch(navigationActions.navigateBackHome())
}

export const scheduleSuccessNotification: ThunkAction = dispatch => {
  return dispatch(
    scheduleNotification(
      createInfoNotification({
        title: I18n.t(strings.GREAT_SUCCESS),
        message: 'Interaction successfully done finished',
      }),
    ),
  )
}
