import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { ThunkAction } from '../../store'
import { CredentialVerificationSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { InteractionChannel } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'
import { CredentialRequestFlow } from '@jolocom/sdk/js/src/lib/interactionManager/credentialRequestFlow'
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

  // @ts-ignore
  const availableCredentials = (interaction.flow as CredentialRequestFlow).getAvailableCredentials(summary.state.constraints[0])

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.Consent,
      params: {
        interactionId: interaction.id,
        interactionSummary: interaction.getSummary(),
        availableCredentials
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
