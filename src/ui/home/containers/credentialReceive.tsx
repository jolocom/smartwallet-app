import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  convertToDecoratedClaim,
  saveCredentialsWithMetadata,
} from 'src/actions/account'
import { CredentialDialogComponent } from '../components/credentialDialog'
import { cancelReceiving, consumeInteractionRequest } from 'src/actions/sso'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { View } from 'react-native'
import { ThunkDispatch } from '../../../store'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { CredentialOfferSummary } from '../../../actions/sso/types'
import { withConsentSummary } from '../../generic/consentWithSummaryHOC'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { httpAgent } from '../../../lib/http'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialMetadataSummary } from '../../../lib/storage/storage'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { prepareCredentialOfferResponse } from '../../../actions/sso/credentialOfferResponse'

const extractCredentialMetadata = ({
  interactionToken,
  issuer,
}: JSONWebToken<CredentialOfferRequest>): CredentialMetadataSummary[] =>
  interactionToken.offeredTypes.map(type => ({
    issuer: {
      did: keyIdToDid(issuer),
    },
    type,
    renderInfo: interactionToken.getRenderInfoForType(type) || {},
    metadata: interactionToken.getMetadataForType(type) || {},
  }))

interface Props extends ReturnType<typeof mapDispatchToProps> {
  interactionRequest: CredentialOfferSummary
}
// Automatically extracted
// TODO change convertToDecoratedClaim to (metadata) => (cred): decoratedClaim
// the types of the cred metadata arrays where it is use differ too much to do it simply right now
const toDecoratedClaim = (
  providedCredential: SignedCredential,
  selectedMetadata: CredentialMetadataSummary[],
) => {
  const [firstMatch] = selectedMetadata.filter(metadataEntry =>
    providedCredential.type.includes(metadataEntry.type),
  )

  return {
    ...convertToDecoratedClaim(providedCredential),
    renderInfo: firstMatch && firstMatch.renderInfo,
  }
}

const CredentialReceiveContainer = ({
  interactionRequest,
  prepareAndSendOfferResponse,
  goBack,
  saveExternalCredentials,
}: Props) => {
  const credOffer = interactionRequest.request as JSONWebToken<
    CredentialOfferRequest
  >

  const [offeredCredential, setOfferedCredential] = useState<{
    credential: SignedCredential
    metadata: CredentialMetadataSummary[]
  }>()

  useEffect(() => {
    prepareAndSendOfferResponse(interactionRequest).then(({ request }) => {
      const metadata = extractCredentialMetadata(credOffer)
      const credentials = (request as JSONWebToken<CredentialsReceive>)
        .interactionToken.signedCredentials

      setOfferedCredential({
        credential: credentials[0],
        metadata,
      })
    })
  }, [])

  return offeredCredential ? (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.9 }}>
        <CredentialDialogComponent
          requester={interactionRequest.requester}
          credentialToRender={toDecoratedClaim(
            offeredCredential.credential,
            offeredCredential.metadata,
          )}
        />
      </View>
      <View style={{ flex: 0.1 }}>
        <ButtonSection
          confirmText={'Accept'}
          denyText={'Deny'}
          handleConfirm={() =>
            saveExternalCredentials(
              offeredCredential.credential,
              offeredCredential.metadata[0],
            )
          }
          handleDeny={goBack}
          disabled={false}
        />
      </View>
    </View>
  ) : null
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  prepareAndSendOfferResponse: async (
    credentialOffer: CredentialOfferSummary,
  ) =>
    dispatch(
      withErrorScreen(
        withLoading(
          async (dispatch, getState, { identityWallet, keyChainLib }) => {
            const credOfferResponse = await identityWallet.create.interactionTokens.response.offer(
              prepareCredentialOfferResponse(credentialOffer),
              await keyChainLib.getPassword(),
              credentialOffer.request,
            )

            const { token } = await httpAgent.postRequest<{ token: string }>(
              credentialOffer.request.interactionToken.callbackURL,
              { 'Content-Type': 'application/json' },
              { token: credOfferResponse.encode() },
            )

            return dispatch(consumeInteractionRequest(token))
          },
        ),
      ),
    ),

  saveExternalCredentials: (
    credential: SignedCredential,
    metadata: CredentialMetadataSummary,
  ) =>
    dispatch(
      withErrorScreen(
        withLoading(saveCredentialsWithMetadata(credential, metadata)),
      ),
    ),
  goBack: () => dispatch(withLoading(cancelReceiving)),
})

export const CredentialReceive = withConsentSummary(
  connect(
    null,
    mapDispatchToProps,
  )(CredentialReceiveContainer),
)
