import React from 'react'
import { Container } from '../../structure'
import { StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native'
import { Scanner } from './scanner'
import { NavigationScreenProps } from 'react-navigation'
import { white } from '../../../styles/colors'
import { ThunkDispatch } from '../../../store'
import { connect } from 'react-redux'
import { CloseIcon } from '../../../resources'
import { fontMain, textXXS } from '../../../styles/typography'
import { Colors } from '../../../styles'
import { navigatorResetHome } from '../../../actions/navigation'
import { consumeInteractionToken } from 'src/actions/sso/consumeInteractionToken'
import { ErrorCode, AppError } from 'src/lib/errors'
import { showErrorScreen } from 'src/actions/generic'

const IS_IOS = Platform.OS === 'ios'

const styles = StyleSheet.create({
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
    <Container style={{ backgroundColor: Colors.greyDark }}>
      {IS_IOS && (
        <TouchableOpacity
          onPress={props.navigateHome}
          style={styles.closeButton}
        >
          <CloseIcon />
        </TouchableOpacity>
      )}
      <Scanner
        consumeToken={props.consumeToken}
        navigation={props.navigation}
      />
    </Container>
  </React.Fragment>
)

// TODO: move these ErrorCodes to lib as LibError or something
// in the App we should have just the errors that match user experience
const localNotificationErrors = [
  // AppError: "Wrong QR"
  ErrorCode.ParseJWTFailed,

  // AppError: "Wrong Data"
  ErrorCode.WrongDID,
  ErrorCode.WrongNonce,
  ErrorCode.InvalidSignature,
  ErrorCode.TokenExpired,
]

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  navigateHome: () => dispatch(navigatorResetHome()),
  consumeToken: async (jwt: string) => {
    try {
      return dispatch(consumeInteractionToken(jwt))
    } catch (e) {
      if (localNotificationErrors.includes(e.message)) {
        throw e
      } else {
        return dispatch(showErrorScreen(new AppError(ErrorCode.Unknown, e)))
      }
    }
  },
})

export const InteractionScreen = connect(
  null,
  mapDispatchToProps,
)(InteractionContainer)
