import * as React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'src/store'
import { accountActions, genericActions } from 'src/actions'
import { Dimensions, Image, StyleSheet, Text } from 'react-native'
import { withErrorHandler } from 'src/actions/modifiers'
import { Container } from '../structure'
import { AppError, ErrorCode } from 'src/lib/errors'
import { showErrorScreen } from 'src/actions/generic'
import { Typography, Colors } from 'src/styles'
const image = require('src/resources/img/splashScreen.png')

interface Props extends ReturnType<typeof mapDispatchToProps> {}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: Colors.blackMain,
  },
  loadingText: {
    position: 'absolute',
    bottom: '5%',
    ...Typography.baseFontStyles,
    fontSize: Typography.text3XS,
    color: Colors.sandLight070,
    textAlign: 'center',
  },
})

export class AppInitContainer extends React.Component<Props> {
  public constructor(props: Props) {
    super(props)
    this.props.doAppInit()
  }

  public render() {
    const viewWidth: number = Dimensions.get('window').width
    const viewHeight: number = Dimensions.get('window').height

    return (
      <Container style={styles.loadingContainer}>
        <Image
          source={image}
          style={{
            bottom: '15%',
            width: viewWidth,
            height: viewHeight / 2,
          }}
        />
        <Text style={styles.loadingText}>POWERED BY JOLOCOM</Text>
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  doAppInit: async () => {
    const withErrorScreen = withErrorHandler(
      showErrorScreen,
      (err: Error) => new AppError(ErrorCode.AppInitFailed, err),
    )
    await dispatch(withErrorScreen(genericActions.initApp))
    await dispatch(withErrorScreen(accountActions.checkIdentityExists))

    // const handleDeepLink = (url: string) =>
    //   dispatch(
    //     withLoading(withErrorScreen(navigationActions.handleDeepLink(url))),
    //   )
    //
    // // FIXME: get rid of these after setting up deepLinking properly using
    // // react-navigation
    // Linking.addEventListener('url', event => handleDeepLink(event.url))
    // Linking.getInitialURL().then(url => {
    //   if (url) handleDeepLink(url)
    // })
  },
})

export const AppInit = connect(
  null,
  mapDispatchToProps,
)(AppInitContainer)
