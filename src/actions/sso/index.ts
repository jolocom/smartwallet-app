import { navigationActions } from 'src/actions'
import { ThunkAction } from '../../store'

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
  startChannel,
  consumeEstablishChannelRequest,
} from './establishChannel'

export { consumeResolutionRequest } from './resolution'

export const cancelSSO: ThunkAction = dispatch => {
  return dispatch(navigationActions.navigatorResetHome())
}
