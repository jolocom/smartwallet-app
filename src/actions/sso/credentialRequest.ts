import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { ThunkAction } from '../../store'
import { CredentialVerificationSummary, CredentialRequestFlowState } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { InteractionChannel } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'
import { cancelSSO } from './'
import isEmpty from 'ramda/es/isEmpty'
import { getUiCredentialTypeByType } from '@jolocom/sdk/js/src/lib/util'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

export const consumeCredentialRequest = (
  credentialRequest: JSONWebToken<CredentialRequest>,
  interactionChannel: InteractionChannel, // TODO replace with send function at one point
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { interactionManager } = backendMiddleware

  const interaction = await interactionManager.start(
    interactionChannel,
    credentialRequest,
  )

  // TODO - Eugeniu
  // Must refactor this abomination.

  const credentialsPerType = await Promise.all(credentialRequest.interactionToken.requestedCredentialTypes.map(interaction.getAttributesByType))

  const populatedWithCredentials = await Promise.all(
    credentialsPerType.map(({ results, type }) =>
      isEmpty(results) ? [{
        type: getUiCredentialTypeByType(type),
        values: [],
        verifications: [],
      }] : Promise.all(results.map(async ({ values, verification }) => ({
        type: getUiCredentialTypeByType(type),
        values,
        verifications: await interaction.getVerifiableCredential({
          id: verification,
        })
    })))))
  
  debugger
  const abbreviated = populatedWithCredentials.map(attribute =>
    attribute.map(entry => ({
      ...entry,
      verifications: entry.verifications.map((vCred: SignedCredential) => ({
        id: vCred.id,
        issuer: {
          did: vCred.issuer,
        },
        selfSigned: vCred.signer.did === getState().account.did.did,
        expires: vCred.expires,
      })),
    })),
  )

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.Consent,
      params: {
        interactionId: interaction.id,
        interactionSummary: interaction.getSummary(),
        availableCredentials: abbreviated.reduce((acc, val) => acc.concat(val))
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
