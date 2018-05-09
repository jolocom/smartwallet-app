import * as React from 'react'
import { connect } from 'react-redux'
import { registrationActions } from 'src/actions'
import { RootState } from 'src/reducers/'
import { Container, CenteredText } from 'src/ui/structure/'
const loaders = require('react-native-indicator')

export interface ConnectProps {
  loadingMsg: string,
  createIdentity: (encodedEntropy: string) => void
}

interface Props extends ConnectProps {
  navigation: { state: { params: { encodedEntropy: string } } }
}

export interface State {
}

export class LoadingContainer extends React.Component<Props, State> {
  componentDidMount() {
    const { encodedEntropy } = this.props.navigation.state.params
    this.props.createIdentity(encodedEntropy)
  }

  render() {
    return (
      <Container>
        <loaders.RippleLoader color="#00ff00" />
        <CenteredText msg={this.props.loadingMsg} />
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    loadingMsg: state.registration.loading.getIn(['loadingMsg'])
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    createIdentity: (entropy: string) =>
      dispatch(registrationActions.createIdentity(entropy))
  }
}

export const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingContainer)
