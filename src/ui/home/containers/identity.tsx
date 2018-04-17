import React from 'react'
import { IdentityComponent } from 'src/ui/home/components/identity'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { accountActions } from 'src/actions'
import { RootState } from 'src/reducers/'

interface ConnectProps {
  // did: string
  // setDid: (did: string) => void
}

interface Props extends ConnectProps {}

interface State {}



export class IdentityContainer extends React.Component<Props, State> {

  state = {}

  render() {
    console.log(this.props, 'nav')
    return <IdentityComponent 
      // did= { this.props.did }
    />
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    // did: state.account.did
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {}
}

export const Identity = connect(mapStateToProps, mapDispatchToProps)(IdentityContainer)
