import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ConsentComponent } from 'src/ui/sso/components/consent'
import { ssoActions } from 'src/actions'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen, withLoading } from 'src/actions/modifiers'
import {
  CredentialRequestSummary,
  CredentialTypeSummary,
  CredentialVerificationSummary,
} from '../../../actions/sso/types'
import { withConsentSummary } from '../../generic/consentWithSummaryHOC'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { RootState } from '../../../reducers'
import {
  fetchMatchingCredentials,
  prepareAndSendCredentialResponse,
} from '../../../actions/sso/credentialRequest'

// TODO INJECT SENDER

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  interactionRequest: CredentialRequestSummary
}

const ShareConsentContainer = ({
  interactionRequest,
  prepareCredentialResponse,
  currentDid,
  sendCredentialResponse,
  cancelSSO,
}: Props) => {
  const [availableCredentials, setAvailableCredentials] = useState<
    CredentialTypeSummary[]
  >()
  const { requester, request, callbackURL } = interactionRequest

  useEffect(() => {
    prepareCredentialResponse(request as JSONWebToken<CredentialRequest>).then(
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
        sendCredentialResponse(selected, interactionRequest, false)
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
    interactionRequest: JSONWebToken<CredentialRequest>,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen(
          fetchMatchingCredentials(
            interactionRequest.interactionToken.requestedCredentialTypes,
          ),
        ),
      ),
    ),
  sendCredentialResponse: (
    credentials: CredentialVerificationSummary[],
    credentialRequestDetails: CredentialRequestSummary,
    isDeepLinkInteraction: boolean,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen(
          prepareAndSendCredentialResponse(
            credentials,
            credentialRequestDetails,
            isDeepLinkInteraction,
          ),
        ),
      ),
    ),
  cancelSSO: () => dispatch(ssoActions.cancelSSO),
})

// TODO RENAME withConsentSummary to withInteractionTokenValidation or something like that.
export const ShareConsent = withConsentSummary(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ShareConsentContainer),
)
