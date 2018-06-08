import React from 'react'
import { ClaimDetailsComponent } from 'src/ui/home/components/claimDetails'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { accountActions } from 'src/actions'
import { DecoratedClaims } from 'src/reducers/account/'
import { ClaimsState } from 'src/reducers/account'
import Immutable from 'immutable'

interface ConnectProps {
  claims: ClaimsState
  saveClaim: (claimsItem: DecoratedClaims) => void
}

interface Props extends ConnectProps {}

interface State {
  selectedClaim: DecoratedClaims
}

export class ClaimDetailsContainer extends React.Component<Props, State> {
  state = {
    selectedClaim: {
      displayName: '',
      type: ['', ''],
      claims: [],
    }
  }

  componentWillMount() {
  }

  render() {
      return (
        <ClaimDetailsComponent
          saveClaim={ this.props.saveClaim }
          selectedClaim={ this.props.claims.selected }
        />
      )
    }
}

const mapStateToProps = (state: RootState) => {
  const claims = Immutable.fromJS(state.account.claims)
  return {
    claims: claims.toJS()
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    saveClaim: (claimsItem: DecoratedClaims) => {
      dispatch(accountActions.saveClaim(claimsItem))
    }
  }
}

export const ClaimDetails = connect(mapStateToProps, mapDispatchToProps)(ClaimDetailsContainer)
