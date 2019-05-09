import React from 'react'
import { ClaimDetailsComponent } from 'src/ui/home/components/claimDetails'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { accountActions } from 'src/actions'
import { ClaimsState } from 'src/reducers/account'
import Immutable from 'immutable'

interface ConnectProps {
  claims: ClaimsState
  saveClaim: () => void
  handleClaimInput: (fieldValue: string, fieldName: string) => void
}

interface Props extends ConnectProps {}

interface State {}

export class ClaimDetailsContainer extends React.Component<Props, State> {
  render() {
    return (
      <ClaimDetailsComponent
        saveClaim={this.props.saveClaim}
        handleClaimInput={this.props.handleClaimInput}
        selectedClaim={this.props.claims.selected}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const claims = Immutable.fromJS(state.account.claims)
  return {
    claims: claims.toJS(),
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  saveClaim: () => {
    dispatch(accountActions.saveClaim())
  },
  handleClaimInput: (fieldValue: string, fieldName: string) => {
    dispatch(accountActions.handleClaimInput(fieldValue, fieldName))
  },
})

export const ClaimDetails = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimDetailsContainer)
