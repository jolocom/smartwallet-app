import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Container } from 'src/ui/structure'
import { Button } from 'react-native-material-ui'
import { QrScanEvent } from 'src/ui/generic/qrcodeScanner'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'
import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from 'src/lib/storage/interactionTokens'
import { ThunkDispatch } from 'src/store'
import { showErrorScreen } from 'src/actions/generic'
import { withLoading, withErrorScreen } from 'src/actions/modifiers'
import { NavigationScreenProps } from 'react-navigation'
import { AppError, ErrorCode } from 'src/lib/errors'
import { Colors } from 'src/styles'

const QRScanner = require('react-native-qrcode-scanner').default

export interface QrScanEvent {
  data: string
}

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    NavigationScreenProps {}

interface State {}

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const overlayColor = 'rgba(0,0,0,0.65)'
const overlayMargin = 44
const rectDimensions = SCREEN_WIDTH - overlayMargin * 2
const rectBorderWidth = 2
const rectBorderColor = 'white'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderRadius: 5,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  verticalOverlay: {
    flex: 1,
    backgroundColor: overlayColor,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalOverlay: {
    height: rectDimensions,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
  },
})

export class QRcodeScanner extends React.Component<Props, State> {
  private scanner: typeof QRScanner
  private removeFocusListener: (() => void) | undefined

  constructor(props: Props) {
    super(props)
    if (this.props.navigation) {
      this.removeFocusListener = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.scanner.reactivate()
          // NOTE: force an update to force remounting of the Camera
          this.forceUpdate()
        },
      ).remove
    }
  }

  componentWillUnmount() {
    if (this.removeFocusListener) this.removeFocusListener()
  }

  onScannerCancel() {
    if (this.props.navigation) this.props.navigation.goBack()
  }

  render() {
    const { onScannerSuccess } = this.props
    // NOTE: the key is used to invalidate the previously rendered component as
    // we need to rerender and remount the camera to ensure it is properly setup
    const cameraProps = { key: Date.now() }
    return (
      <React.Fragment>
        <Container style={styles.container}>
          <QRScanner
            containerStyle={{ position: 'absolute', top: 0 }}
            cameraProps={cameraProps}
            ref={(ref: React.Component) => (this.scanner = ref)}
            onRead={onScannerSuccess}
            cameraStyle={{ height: SCREEN_HEIGHT }}
          />
          <View style={styles.verticalOverlay} />
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.horizontalOverlay} />
            <View style={styles.rectangle} />
            <View style={styles.horizontalOverlay} />
          </View>
          <View style={styles.verticalOverlay} />
        </Container>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onScannerSuccess: async (e: QrScanEvent) => {
    let interactionToken

    try {
      interactionToken = JolocomLib.parse.interactionToken.fromJWT(e.data)
    } catch (err) {
      return dispatch(
        showErrorScreen(new AppError(ErrorCode.ParseJWTFailed, err)),
      )
    }

    const handler = interactionHandlers[interactionToken.interactionType]

    return handler
      ? dispatch(withLoading(withErrorScreen(handler(interactionToken))))
      : dispatch(
          showErrorScreen(
            new AppError(ErrorCode.Unknown, new Error('No handler found')),
          ),
        )
  },
})

export const QRScannerContainer = connect(
  null,
  mapDispatchToProps,
)(QRcodeScanner)
