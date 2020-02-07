import React from 'react'
import { Wrapper } from '../../structure'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { ScannerContainer } from './scanner'
import { NavigationInjectedProps } from 'react-navigation'
import { white } from '../../../styles/colors'
import { ThunkDispatch } from '../../../store'
import { connect } from 'react-redux'
import { CloseIcon } from '../../../resources'
import { fontMain, textXXS } from '../../../styles/typography'

import { consumeInteractionToken } from 'src/actions/sso/consumeInteractionToken'
import { ErrorCode, AppError } from 'src/lib/errors'
import { showErrorScreen } from 'src/actions/generic'
import { navigateBack } from '../../../actions/navigation'

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
    NavigationInjectedProps {}

const InteractionContainer = (props: Props) => {
  return (
    <Wrapper dark withoutSafeArea>
      {IS_IOS && (
        <TouchableOpacity
          onPress={props.navigateHome}
          style={styles.closeButton}
        >
          <CloseIcon />
        </TouchableOpacity>
      )}
      <ScannerContainer
        navigation={props.navigation}
        onScannerSuccess={props.consumeToken}
      />
    </Wrapper>
  )
}

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
  navigateHome: () => dispatch(navigateBack()),
})

export const InteractionScreen = connect(
  null,
  mapDispatchToProps,
)(InteractionContainer)
