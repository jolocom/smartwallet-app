import React from 'react'
import { connect } from 'react-redux'
import { ConsentComponent } from 'src/ui/sso/components/consent'
import { ssoActions } from 'src/actions'
import { ThunkDispatch } from 'src/store'
import { withLoading, withErrorScreen } from 'src/actions/modifiers'
import {
  CredentialRequestSummary,
  CredentialVerificationSummary,
} from '../../../actions/sso/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { withConsentSummary } from '../../generic/consentWithSummaryHOC'

interface CredentialRequestNavigationParams {
  isDeepLinkInteraction: boolean
  jwt: string
}

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  navigation: NavigationScreenProp<
    NavigationState,
    CredentialRequestNavigationParams
  >
  interactionDetails: CredentialRequestSummary
}

const ConsentContainer = (props: Props) => {
  const {
    interactionDetails,
    currentDid,
    sendCredentialResponse,
    cancelSSO,
    navigation: {
      state: {
        params: { isDeepLinkInteraction },
      },
    },
  } = props

  const handleSubmitClaims = (credentials: CredentialVerificationSummary[]) => {
    sendCredentialResponse(
      credentials,
      interactionDetails,
      isDeepLinkInteraction,
    )
  }

  const { availableCredentials, requester, callbackURL } = interactionDetails
  return (
    <ConsentComponent
      requester={requester}
      callbackURL={callbackURL}
      did={currentDid}
      availableCredentials={availableCredentials}
      handleSubmitClaims={handleSubmitClaims}
      handleDenySubmit={cancelSSO}
    />
  )
}

const mapStateToProps = (state: any) => ({
  currentDid: state.account.did.did,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  sendCredentialResponse: (
    credentials: CredentialVerificationSummary[],
    credentialRequestDetails: CredentialRequestSummary,
    isDeepLinkInteraction: boolean,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen(
          ssoActions.sendCredentialResponse(
            credentials,
            credentialRequestDetails,
            isDeepLinkInteraction,
          ),
        ),
      ),
    ),
  cancelSSO: () => dispatch(ssoActions.cancelSSO),
})

export const Consent = withConsentSummary(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConsentContainer),
)
