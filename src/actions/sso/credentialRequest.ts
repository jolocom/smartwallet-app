import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { ThunkAction } from '../../store'
import { CredentialVerificationSummary } from './types'
import { InteractionChannel } from 'src/lib/interactionManager/types'
import { Interaction } from 'src/lib/interactionManager/interaction'
import { cancelSSO } from './'

export const consumeCredentialRequest = (
  credentialRequest: JSONWebToken<CredentialRequest>,
  interactionChannel: InteractionChannel, // TODO replace with send function at one point
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { interactionManager } = backendMiddleware

  const interaction = await interactionManager.start(
    interactionChannel,
    credentialRequest,
  )

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.Consent,
      params: {
        interactionId: interaction.id,
        interactionSummary: interaction.getSummary(),
      },
      key: 'credentialRequest',
    }),
  )
}

export const sendCredentialResponse = (
  selectedCredentials: CredentialVerificationSummary[],
  interactionId: string,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interaction: Interaction = interactionManager.getInteraction(
    interactionId,
  )

  return interaction
    .send(await interaction.createCredentialResponse(selectedCredentials))
    .then(() => dispatch(cancelSSO))
}
