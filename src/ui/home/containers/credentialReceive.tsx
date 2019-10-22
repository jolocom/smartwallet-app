import React from 'react'
import { connect } from 'react-redux'
import { saveExternalCredentials } from 'src/actions/account'
import { CredentialDialogComponent } from '../components/credentialDialog'
import { cancelReceiving } from 'src/actions/sso'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { View } from 'react-native'
import { ThunkDispatch } from '../../../store'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { CredentialReceiveSummary } from '../../../actions/sso/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { withConsentSummary } from '../../generic/consentWithSummaryHOC'

interface NavigationProps {
  isDeepLinkInteraction: boolean
  jwt: string
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, NavigationProps>
  interactionDetails: CredentialReceiveSummary
}

export const CredentialsReceiveContainer = (props: Props) => {
  const { interactionDetails } = props

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.9 }}>
        <CredentialDialogComponent
          requester={interactionDetails.requester}
          credentialToRender={interactionDetails.external[0].decoratedClaim}
        />
      </View>
      <View style={{ flex: 0.1 }}>
        <ButtonSection
          confirmText={'Accept'}
          denyText={'Deny'}
          handleConfirm={props.saveExternalCredentials}
          handleDeny={props.goBack}
          disabled={false}
        />
      </View>
    </View>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  saveExternalCredentials: () =>
    dispatch(withErrorScreen(withLoading(saveExternalCredentials))),
  goBack: () => dispatch(withLoading(cancelReceiving)),
})

export const CredentialReceive = withConsentSummary(
  connect(
    null,
    mapDispatchToProps,
  )(CredentialsReceiveContainer),
)
