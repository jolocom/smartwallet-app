import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ConsentComponent } from 'src/ui/sso/components/consent'
import { ssoActions } from 'src/actions'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen, withLoading } from 'src/actions/modifiers'
import { withInteractionRequestValidation } from '../../generic/consentWithSummaryHOC'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { RootState } from '../../../reducers'
import {
  fetchMatchingCredentials,
  fetchCredentialsFromDatabase,
} from '../../../actions/sso/credentialRequest'
import { InteractionTokenSender } from '../../../actions/sso'
import {
  CredentialRequestSummary,
  CredentialTypeSummary,
  CredentialVerificationSummary,
} from '../../../utils/interactionRequests/types'

// TODO INJECT SENDER

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  interactionRequest: CredentialRequestSummary
  sendResponse: InteractionTokenSender
}

const ShareConsentContainer = ({
  interactionRequest,
  prepareCredentialResponse,
  sendResponse,
  currentDid,
  generateAndSendCredentialResponse,
  cancelSSO,
}: Props) => {
  const [availableCredentials, setAvailableCredentials] = useState<
    CredentialTypeSummary[]
  >()
  const { requester, request, callbackURL } = interactionRequest

  useEffect(() => {
    prepareCredentialResponse(request, currentDid).then(
      (availableCredentials: CredentialTypeSummary[]) => {
        setAvailableCredentials(availableCredentials)
      },
    )
  }, [])

  return availableCredentials ? (
    <ConsentComponent
      requester={requester}
      callbackURL={callbackURL}
      did={currentDid}
      availableCredentials={availableCredentials}
      handleSubmitClaims={(selected: CredentialVerificationSummary[]) =>
        generateAndSendCredentialResponse(
          selected,
          interactionRequest,
          sendResponse,
        )
      }
      handleDenySubmit={cancelSSO}
    />
  ) : null
}

const mapStateToProps = (state: RootState) => ({
  currentDid: state.account.did.did,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  prepareCredentialResponse: (
    interactionRequest: JSONWebToken<JWTEncodable>,
    did: string,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen((dispatch, getState, { storageLib }) => {
          const interactionToken = interactionRequest.interactionToken as CredentialRequest

          return fetchMatchingCredentials(
            interactionToken.requestedCredentialTypes,
            storageLib,
            did,
          )
        }),
      ),
    ),
  generateAndSendCredentialResponse: (
    credentials: CredentialVerificationSummary[],
    credentialRequestDetails: CredentialRequestSummary,
    sendResponse: InteractionTokenSender,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen(
          async (
            dispatch,
            getState,
            { identityWallet, storageLib, keyChainLib },
          ) =>
            sendResponse(
              await identityWallet.create.interactionTokens.response.share(
                {
                  callbackURL: credentialRequestDetails.callbackURL,
                  suppliedCredentials: await fetchCredentialsFromDatabase(
                    credentials,
                    storageLib,
                  ),
                },
                await keyChainLib.getPassword(),
                credentialRequestDetails.request,
              ),
            ),
        ),
      ),
    ),
  cancelSSO: () => dispatch(ssoActions.cancelSSO),
})

export const ShareConsent = withInteractionRequestValidation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ShareConsentContainer),
)
