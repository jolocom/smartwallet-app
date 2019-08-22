import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { CredentialOverview } from '../components/credentialOverview'
import { accountActions } from 'src/actions'
import { DecoratedClaims } from 'src/reducers/account/'
import { RootState } from '../../../reducers'
import { withLoading } from '../../../actions/modifiers'
import { ThunkDispatch } from '../../../store'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export class ClaimsContainer extends React.Component<Props> {
  public componentWillMount(): void {
    this.props.setClaimsForDid()
  }

  public render(): JSX.Element {
    const { did, claimsState, openClaimDetails } = this.props
    return (
      <View>
        <CredentialOverview
          did={did}
          claimsToRender={claimsState.decoratedCredentials}
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
  },
}: RootState) => ({ did, claimsState })

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openClaimDetails: (claim: DecoratedClaims) =>
    dispatch(accountActions.openClaimDetails(claim)),
  setClaimsForDid: () => dispatch(withLoading(accountActions.setClaimsForDid)),
})

export const Claims = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsContainer)
