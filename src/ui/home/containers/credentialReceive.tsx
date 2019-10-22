import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { saveExternalCredentials } from 'src/actions/account'
import { CredentialDialogComponent } from '../components/credentialDialog'
import { cancelReceiving } from 'src/actions/sso'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { View } from 'react-native'
import { ThunkDispatch } from '../../../store'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export const CredentialsReceiveContainer = (props: Props) => (
  <View style={{ flex: 1 }}>
    <View style={{ flex: 0.9 }}>
      <CredentialDialogComponent
        requester={props.requester}
        credentialToRender={props.offer}
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

const mapStateToProps = (state: RootState) => ({
  offer: state.account.claims.pendingExternal.offer[0].decoratedClaim,
  requester: state.account.claims.pendingExternal.offeror,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  saveExternalCredentials: () =>
    dispatch(withErrorScreen(withLoading(saveExternalCredentials))),
  goBack: () => dispatch(withLoading(cancelReceiving)),
})

export const CredentialReceive = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CredentialsReceiveContainer)
