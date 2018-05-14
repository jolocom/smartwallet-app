import * as React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { registrationActions } from 'src/actions'
import { RootState } from 'src/reducers/'
import { Container, CenteredText, Block } from 'src/ui/structure/'
import { JolocomTheme } from 'src/styles/jolocom-theme'
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

const styles = StyleSheet.create({
  block: {
    marginBottom: "15%"
  },
  container: {
    backgroundColor: JolocomTheme.palette.primaryColorBlack,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    color: JolocomTheme.palette.primaryTextColorSand,
    fontSize: 20
  }
})

export class LoadingContainer extends React.Component<Props, State> {
  componentDidMount() {
    const { encodedEntropy } = this.props.navigation.state.params
    this.props.createIdentity(encodedEntropy)
  }

  render() {
    return (
      <Container style={styles.container} >
        <Block>
          <CenteredText style={styles.text} msg={"Give us a few moments to set up your identity"} />
        </Block>
          <loaders.RippleLoader size={100} strokeWidth={5} color={JolocomTheme.palette.spinnerColor} />
        <Block>
          <Icon name='circle' color={JolocomTheme.palette.primaryTextColorSand} />
        </Block>
        <Block>
          <CenteredText style={styles.text} msg={this.props.loadingMsg} />
        </Block>
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
