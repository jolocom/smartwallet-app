import React from 'react'
import { ConsentComponent } from 'src/ui/home/components/consent'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { RootState } from 'src/reducers/'

interface ConnectProps { }

interface Props extends ConnectProps {}

interface State {
  // serviceProvider: object
  requestedClaims: string[]
  checkboxList: SingleCheckBox[]
}

export interface SingleCheckBox {
  value: string
  label: string
  checked: boolean
}

//TODO: update the typings for service providers
// export interface ServiceProvider {
//   name: string
//   metadata: string
// }

export class ConsentContainer extends React.Component<Props, State> {

  state = {
    //serviceProvider should be passed in
    // serviceProvider: { name: 'Jolocom', metadata: 'xyz'},
    //requestedClaims should be passed in
    requestedClaims: ['name', 'email', 'passport'],
    checkboxList: [],
  }

  componentDidMount() {
    this.mapRequestedClaimsToCheckboxes(this.state.requestedClaims)
  }

  //TODO: set into redux action here?
  private mapRequestedClaimsToCheckboxes(requestedClaims: string[]) {
    const checkboxList: SingleCheckBox[] = []
    requestedClaims.forEach((claim: string) => {
      checkboxList.push(
        {
          value: claim,
          label: claim,
          checked: false
        }
      )
    })
    this.setState({ checkboxList })
  }

  private handleSubmitClaims() {
    console.log('submitting')
  }

  private handleDenySubmit() {
    console.log('denied')
  }

  render() {
    return (
    <ConsentComponent
      // serviceProvider={ this.state.serviceProvider }
      checkboxList={ this.state.checkboxList }
      handleSubmitClaims={ this.handleSubmitClaims }
      handleDenySubmit={ this.handleDenySubmit }
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