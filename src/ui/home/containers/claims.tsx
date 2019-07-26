import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { CredentialOverview } from '../components/credentialOverview'
import { accountActions } from 'src/actions'
import { DecoratedClaims } from 'src/reducers/account/'
import { RootState } from '../../../reducers'
import { withLoading } from '../../../actions/modifiers'
import { setDeepLinkLoading } from '../../../actions/sso'
import { ThunkDispatch } from '../../../store'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export class ClaimsContainer extends React.Component<Props> {
  public componentWillMount(): void {
    this.props.setClaimsForDid()
  }

  public render(): JSX.Element {
    const { did, loading, claimsState, openClaimDetails } = this.props
    return (
      <View style={{ flex: 1 }}>
        <CredentialOverview
          did={did}
          claimsToRender={claimsState.decoratedCredentials}
          loading={!!loading}
          onEdit={openClaimDetails}
        />
      </View>
    )
  }
}

const mapStateToProps = ({
  account: {
    did: { did },
    claims: claimsState,
    loading: { loading },
  },
}: RootState) => ({ did, claimsState, loading })

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openClaimDetails: (claim: DecoratedClaims) =>
    dispatch(accountActions.openClaimDetails(claim)),
  setClaimsForDid: () =>
    // FIXME XXX TODO
    // NOTE: this uses setDeepLinkLoading because deep link loading is managed
    // by NavigationContainer, which will be able to show a loading spinner
    // The other loading spinner is INSIDE CredentialOverview, so not useable
    dispatch(withLoading(setDeepLinkLoading)(accountActions.setClaimsForDid)),
})

export const Claims = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsContainer)
