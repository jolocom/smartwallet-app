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
  saveClaim: (claimVal: string, claimField: string) => void
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
    const { selected, claims } = this.props.claims
    Object.keys(claims).map((key: string, index) => {
      claims[key].map((item: DecoratedClaims) => {
        if (item.claims[0].id === selected.claims[0].id) {
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
    claims: claims.toJS()
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
