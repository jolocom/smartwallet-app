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
import { withInteractionRequestValidation } from '../../generic/consentWithSummaryHOC'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { RootState } from '../../../reducers'
import {
  fetchMatchingCredentials,
  fetchCredentialsFromDatabase,
} from '../../../actions/sso/credentialRequest'
import { cancelSSO, sendInteractionToken } from '../../../actions/sso'

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
        // TODO - PASS
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
    did: string,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen((dispatch, getState, { storageLib }) =>
          fetchMatchingCredentials(
            interactionRequest.interactionToken.requestedCredentialTypes,
            storageLib,
            did,
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
          async (
            dispatch,
            getState,
            { identityWallet, storageLib, keyChainLib },
          ) => {
            const credentialResponse = await identityWallet.create.interactionTokens.response.share(
              {
                callbackURL: credentialRequestDetails.callbackURL,
                suppliedCredentials: await fetchCredentialsFromDatabase(
                  credentials,
                  storageLib,
                ),
              },
              await keyChainLib.getPassword(),
              credentialRequestDetails.request,
            )

            return sendInteractionToken(
              isDeepLinkInteraction,
              credentialResponse,
            ).finally(() => dispatch(cancelSSO()))
          },
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
