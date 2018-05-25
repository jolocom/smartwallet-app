import React from 'react'
import { ClaimDetailsComponent } from 'src/ui/home/components/claimDetails'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { accountActions } from 'src/actions'

interface ConnectProps {
  claims: any
  saveClaim: (claimVal: string, claimField: string) => void
}

interface Props extends ConnectProps {}

// TODO: type
interface State {
  selectedClaim: any
}

export class ClaimDetailsContainer extends React.Component<Props, State> {

state = {
  selectedClaim: ''
}

componentWillMount() {
  const { claims } = this.props
  // TODO: type
  const { id, claimField } = claims.selected
  for (let key in claims.savedClaims) {
    claims.savedClaims[key].map((item: any, i: number) => {
      if(item.id === id && item.claimField === claimField) {
        this.setState({
          selectedClaim: item
        })
      }
    })
  }
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
  return {
    claims: state.account.claims.toObject()
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
