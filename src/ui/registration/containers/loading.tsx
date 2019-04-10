import * as React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { registrationActions } from 'src/actions'
import { RootState } from 'src/reducers/'
import Immutable from 'immutable'
import { Container, CenteredText, Block } from 'src/ui/structure/'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
const loaders = require('react-native-indicator')

export interface ConnectProps {
  loadingStage: number,
  loadingStages: string[]
  createIdentity: (encodedEntropy: string) => void
}

interface Props extends ConnectProps {
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
    backgroundColor: JolocomTheme.primaryColorBlack,
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
    color: JolocomTheme.primaryColorSand
  },
  dotInactive: {
    marginRight: 5,
    marginLeft: 5,
    color: JolocomTheme.primaryColorGrey
  },
  text: {
    color: JolocomTheme.primaryColorSand,
    fontSize: 20,
    fontFamily: JolocomTheme.contentFontFamily
  },
  smallText: {
    color: JolocomTheme.primaryColorSand,
    fontSize: 14,
    fontFamily: JolocomTheme.contentFontFamily
  }
})

// TODO SFC
export class LoadingContainer extends React.Component<Props, State> {
  render() {
    const {loadingStage, loadingStages} = this.props;
    return (
      <Container style={styles.container} >
        <Block style={styles.label} >
          <CenteredText style={styles.text} msg={ I18n.t('Give us a few moments') } />
          <CenteredText style={styles.text} msg={ I18n.t('to set up your identity') } />
        </Block>
        <Block>
          <loaders.RippleLoader size={80} strokeWidth={4} color={JolocomTheme.spinnerColor} />
        </Block>
        <Block style={styles.loadingMsg}>
          <View style={styles.dotsContainer}>
            {loadingStages.map((stage, key) => {
              return (
                <Icon
                  name='circle'
                  size={ key <= loadingStage ? 15 : 10 }
                  style={ key <= loadingStage ? styles.dotActive : styles.dotInactive }
                  key={ key }
                />
              )
            }) }
          </View>
          <View>
            <CenteredText style={styles.smallText} msg={loadingStages[loadingStage]} />
          </View>
        </Block>
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const loading = Immutable.fromJS(state.registration.loading)
  return {
    loadingStage: loading.get('loadingStage'),
    loadingStages: loading.get('loadingStages'),
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    createIdentity: (entropy: string) =>
      dispatch(registrationActions.createIdentity(entropy))
  }
}

export const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingContainer)
