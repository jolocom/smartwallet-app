import React from 'react'
import { ConsentComponent } from 'src/ui/home/components/consent'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { RootState } from 'src/reducers/'

interface ConnectProps { }

interface Props extends ConnectProps {}

interface State {
  requestedClaims: string[] 
  checkboxList: object[]
}

//TODO: requestedClaims interface

export class ConsentContainer extends React.Component<Props, State> {

  state = {
    //serviceProvider should be passed in
    serviceProvider: { name: 'Jolocom', metadata: 'xyz'},
    //requestdClaims should be passed in
    requestedClaims: ['name', 'email', 'passport'],
    checkboxList: []
  }

  componentDidMount() {
    this.mapRequestedClaimsToCheckboxes(this.state.requestedClaims)
  }

  private mapRequestedClaimsToCheckboxes (requestedClaims: string[]) {
    //typing
    const checkboxList: object[] = []
    requestedClaims.forEach((claim: string) => {
      checkboxList.push(
        {
          value: claim,
          label: claim,
          checked: false
        }
      )
    })
    //set into redux action here
    this.setState({ checkboxList })
  }

  render() {
    return (
    <ConsentComponent
      serviceProvider={ this.state.serviceProvider }
      claimsProvided={ false }
      checkboxList={ this.state.checkboxList }
     />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {
  }
}

export const Consent = connect(mapStateToProps, mapDispatchToProps)(ConsentContainer)