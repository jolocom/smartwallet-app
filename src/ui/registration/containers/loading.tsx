import * as React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { registrationActions } from 'src/actions'
import * as loading from 'src/actions/registration/loadingStages'
import { RootState } from 'src/reducers/'
import Immutable from 'immutable'
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
  label: {
    alignSelf: 'flex-start',
    marginBottom: '10%'
  },
  loadingMsg: {
    alignSelf: 'flex-end',
    marginBottom: '-10%'
  },
  container: {
    backgroundColor: JolocomTheme.palette.primaryColorBlack,
    height: '100%'
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  dotActive: {
    marginRight: 8,
    marginLeft: 8,
    color: JolocomTheme.palette.primaryTextColorSand //TODO: add a glow
  },
  dotInactive: {
    marginRight: 5,
    marginLeft: 5,
    color: JolocomTheme.palette.textColor_silverGrey
  },
  text: {
    color: JolocomTheme.palette.primaryTextColorSand,
    fontSize: 20,
  },
  smallText: {
    color: JolocomTheme.palette.primaryTextColorSand,
    fontSize: 14
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
        <Block style={styles.label} >
          <CenteredText style={styles.text} msg={"Give us a few moments"} />
          <CenteredText style={styles.text} msg={"to set up your identity"} />
        </Block>
        <Block>
          <loaders.RippleLoader size={80} strokeWidth={4} color={JolocomTheme.palette.spinnerColor} />
        </Block>
        <Block style={styles.loadingMsg}>
          <View style={styles.dotsContainer}>
            {[0,1,2,3].map((prop, key) => {
              var stageNumber = loading.loadingStages.indexOf(this.props.loadingMsg)
              return <Icon name='circle' size={prop <= stageNumber ? 15 : 10} style={prop <= stageNumber ? styles.dotActive : styles.dotInactive} />
            })}
          </View>
          <View>
            <CenteredText style={styles.smallText} msg={this.props.loadingMsg} />
          </View>
        </Block>
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const loading = Immutable.fromJS(state.registration.loading)
  return {
    loadingMsg: loading.get('loadingMsg')
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    createIdentity: (entropy: string) =>
      dispatch(registrationActions.createIdentity(entropy))
  }
}

export const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingContainer)
