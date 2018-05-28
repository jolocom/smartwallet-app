import React from 'react'
import { ClaimDetailsComponent } from 'src/ui/home/components/claimDetails'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { accountActions } from 'src/actions'
import { Claim } from 'src/actions/account/helper'
import { ClaimsState } from 'src/reducers/account'
import Immutable from 'immutable'

interface ConnectProps {
  claims: ClaimsState
  saveClaim: (claimVal: string, claimField: string) => void
}

interface Props extends ConnectProps {}

interface State {
  selectedClaim: Claim
}

export class ClaimDetailsContainer extends React.Component<Props, State> {

state = {
  selectedClaim: {
    id: '',
    type: '',
    claimField: '',
    claimValue: '',
    multiLine: false,
    category: ''
  }
}

componentWillMount() {
  const { selected, savedClaims } = this.props.claims
  const { id, claimField } = selected
  
  Object.keys(savedClaims).map((key: string, index) => {
    savedClaims[key].map((item: Claim) => {
      if (item.id === id && item.claimField === claimField) {
        this.setState({selectedClaim: item})
      }
    })
  })
}

render() {
    return (
      <ClaimDetailsComponent
        saveClaim={ this.props.saveClaim }
        selectedClaim={ this.state.selectedClaim }
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const claims = Immutable.fromJS(state.account.claims)
  return {
    claims: claims.toObject()
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    saveClaim: (claimVal: string, claimField: string) => {
      dispatch(accountActions.saveClaim(claimVal, claimField))
    }
  }
}

export const ClaimDetails = connect(mapStateToProps, mapDispatchToProps)(ClaimDetailsContainer)
