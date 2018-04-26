import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { registrationActions } from 'src/actions'
import { RootState } from 'src/reducers/'
import { Container, CenteredText } from 'src/ui/structure/'

export interface ConnectProps {
  loadingMsg: string,
  generateAndEncryptKeyPairs: (encodedEntropy: string) => void
}

interface Props extends ConnectProps {
  navigation: { state: { params: { encodedEntropy: string } } }
}

export interface State {
}

export class LoadingContainer extends React.Component<Props, State> {
  componentDidMount() {
    const { encodedEntropy } = this.props.navigation.state.params
    this.props.generateAndEncryptKeyPairs(encodedEntropy)
  }

  render() {
    return (
      <Container>
        <ActivityIndicator size='large' color="#00ff00" />
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
    generateAndEncryptKeyPairs: (entropy: string) =>
      dispatch(registrationActions.generateAndEncryptKeyPairs(entropy))
  }
}

export const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingContainer)
