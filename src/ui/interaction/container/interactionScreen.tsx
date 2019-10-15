import React from 'react'
import { Container } from '../../structure'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native'
import { ScannerContainer } from './scanner'
import { NavigationScreenProps } from 'react-navigation'
import { white } from '../../../styles/colors'
import { ThunkDispatch } from '../../../store'
import { JolocomLib } from 'jolocom-lib'
import { showErrorScreen } from '../../../actions/generic'
import { AppError, ErrorCode } from '../../../lib/errors'
import { interactionHandlers } from '../../../lib/storage/interactionTokens'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { connect } from 'react-redux'
import { CloseIcon } from '../../../resources'
import { fontMain, textXXS } from '../../../styles/typography'
import { Colors } from '../../../styles'
import { navigatorResetHome } from '../../../actions/navigation'

const IS_IOS = Platform.OS === 'ios'

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 0.75,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  topWrapper: {
    backgroundColor: Colors.black065,
    flex: 0.7,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: fontMain,
    fontSize: textXXS,
    color: white,
    position: 'absolute',
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    NavigationScreenProps {}

const InteractionContainer = (props: Props) => (
  <React.Fragment>
    <StatusBar hidden />
    <Container style={{ backgroundColor: Colors.blackMain }}>
      {IS_IOS && (
        <TouchableOpacity
          onPress={props.navigateHome}
          style={styles.closeButton}
        >
          <CloseIcon />
        </TouchableOpacity>
      )}
      <View style={styles.topWrapper}>
        <View style={styles.buttonWrapper}>
          <View style={styles.iconWrapper}>
            {/* NOTE: uncomment when implementing bluetooth functionality
            <ScanEnabledIcon />
            <Text style={styles.text}>
              {I18n.t(strings.SCAN.toUpperCase())}
            </Text>
          */}
          </View>
        </View>
        <View style={{ flex: 0.25 }} />
      </View>
      <ScannerContainer
        navigation={props.navigation}
        onScannerSuccess={props.onScannerSuccess}
      />
    </Container>
  </React.Fragment>
)

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onScannerSuccess: async (jwt: string) => {
    let interactionToken

    try {
      interactionToken = JolocomLib.parse.interactionToken.fromJWT(jwt)
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
  navigateHome: () => dispatch(navigatorResetHome()),
})

export const InteractionScreen = connect(
  null,
  mapDispatchToProps,
)(InteractionContainer)
