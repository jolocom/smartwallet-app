import { Dispatch, AnyAction } from 'redux'
import { JolocomLib } from 'jolocom-lib'
import { showErrorScreen } from 'src/actions/generic'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { accountActions, ssoActions } from 'src/actions'

export const parseJWT = (encodedJwt: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(accountActions.toggleLoading(true))
    try {
      const returnedDecodedJwt = await JolocomLib.parse.interactionToken.fromJWT(encodedJwt)
      
      if (returnedDecodedJwt.interactionType === InteractionType.CredentialRequest) {
        dispatch(ssoActions.consumeCredentialRequest(returnedDecodedJwt))
      }
      if (returnedDecodedJwt.interactionType === InteractionType.CredentialOffer) {
        dispatch(ssoActions.consumeCredentialOfferRequest(returnedDecodedJwt))
      }
      if (returnedDecodedJwt.interactionType === InteractionType.CredentialsReceive) {
        dispatch(ssoActions.receiveExternalCredential(returnedDecodedJwt))
      }
    } catch (err) {
      console.log('error: ', err)
      dispatch(accountActions.toggleLoading(false))
      dispatch(showErrorScreen(new Error('JWT Token parse failed')))
    }
  }
}
