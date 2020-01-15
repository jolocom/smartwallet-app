import React, { useEffect, useState } from 'react'
import { Container } from '../../structure'
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
} from 'react-native'
import { ScannerContainer } from './scanner'
import { NavigationScreenProps } from 'react-navigation'
import { white } from '../../../styles/colors'
import { ThunkDispatch } from '../../../store'
import { showErrorScreen } from '../../../actions/generic'
import { AppError, ErrorCode } from '../../../lib/errors'
import { interactionHandlers } from '../../../lib/storage/interactionTokens'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { connect } from 'react-redux'
import { CloseIcon } from '../../../resources'
import { fontMain, textXXS } from '../../../styles/typography'
import { Colors } from '../../../styles'
import { navigatorResetHome } from '../../../actions/navigation'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'

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

const InteractionContainer = (props: Props) => {
  const [AnimatedOpacity] = useState(new Animated.Value(0))
  const [isStatusBar, setStatusBar] = useState(true)

  /*
   * NOTE: (Android only) When navigating to the @InteractionScreen, the homepage
   * (together with the @BottomBar) jumps about 20px up and disrupts
   * the navigation transition. This happens due to the hiding of the
   * @StatusBar. One workaround is delaying it, but the "flicker" is still
   * noticeable.
   */

  useEffect(() => {
    Animated.timing(AnimatedOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStatusBar(false)
    })
  }, [])

  return (
    <React.Fragment>
      <StatusBar hidden={!isStatusBar} />
      <Animated.View
        style={{
          backgroundColor: Colors.greyDark,
          opacity: AnimatedOpacity,
          flex: 1,
        }}
      >
        <Container>
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
            onScannerSuccess={props.onScannerSuccess}
          />
        </Container>
      </Animated.View>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onScannerSuccess: async (interactionToken: JSONWebToken<JWTEncodable>) => {
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
