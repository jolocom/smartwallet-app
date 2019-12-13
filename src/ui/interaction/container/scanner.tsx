import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Animated, AppState, AppStateStatus, Platform } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
/**
 * TODO: When using the latest react-native-permissions version, remove this
 * dependency, since there is already a cross-platform openSettings method
 */
import { appDetailsSettings } from 'react-native-android-open-settings'
// TODO: using v1.2.1. When upgrading to RN60, use the latest version.
import Permissions, { Status } from 'react-native-permissions'

import { ThunkDispatch } from 'src/store'
import { AppError, ErrorCode } from 'src/lib/errors'
import { showErrorScreen } from 'src/actions/generic'
import { consumeInteractionToken } from 'src/actions/sso/consumeInteractionToken'
import { ScannerComponent } from '../component/scanner'
import { NoPermissionComponent } from '../component/noPermission'

interface Props
  extends NavigationScreenProps,
    ReturnType<typeof mapDispatchToProps> {}

const CAMERA_PERMISSION = 'camera'

enum RESULTS {
  AUTHORIZED = 'authorized',
  RESTRICTED = 'restricted',
}

const IS_IOS = Platform.OS === 'ios'

export const ScannerContainer = (props: Props) => {
  const { consumeToken, showError, navigation } = props

  const [reRenderKey, setRenderKey] = useState(Date.now())
  const [permission, setPermission] = useState<Status>(RESULTS.RESTRICTED)
  const [isCameraReady, setCameraReady] = useState(false)
  const [isError, setError] = useState(false)
  const [colorAnimationValue] = useState(new Animated.Value(0))
  const [textAnimationValue] = useState(new Animated.Value(0))

  useEffect(() => {
    let focusListener
    if (navigation) {
      focusListener = navigation.addListener('willFocus', () => {
        // NOTE: the re-render and the re-mount should only fire during the willFocus event
        setRenderKey(Date.now())
      })
    }

    requestCameraPermission().then(() => {
      setTimeout(() => setCameraReady(true), 200)
    })

    return focusListener && focusListener.remove
  }, [])

  const requestCameraPermission = async () => {
    const permission = await Permissions.request(CAMERA_PERMISSION)
    setPermission(permission)
  }

  const openSettings = () => {
    const listener = async (state: AppStateStatus) => {
      if (state === 'active') {
        AppState.removeEventListener('change', listener)
        await requestCameraPermission()
      }
    }

    AppState.addEventListener('change', listener)

    try {
      const openPlatformSettings = Platform.select({
        ios: Permissions.openSettings,
        android: appDetailsSettings,
      })
      openPlatformSettings()
    } catch (e) {
      AppState.removeEventListener('change', listener)
    }
  }

  const onEnablePermission = async () => {
    if (IS_IOS) {
      openSettings()
    } else {
      if (permission === RESULTS.RESTRICTED) {
        openSettings()
      } else {
        await requestCameraPermission()
      }
    }
  }

  const animateColor = () =>
    Animated.sequence([
      Animated.timing(colorAnimationValue, {
        toValue: 1,
        duration: 300,
      }),
      Animated.timing(colorAnimationValue, {
        toValue: 0,
        delay: 400,
        duration: 300,
      }),
    ])

  const animateText = () =>
    Animated.sequence([
      Animated.timing(textAnimationValue, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(textAnimationValue, {
        toValue: 0,
        delay: 1200,
        duration: 500,
      }),
    ])

  const startLocalNotification = () => {
    setError(true)
    Animated.parallel([animateColor(), animateText()]).start(() => {
      setError(false)
    })
  }

  const onScan = async (jwt: string) => {
    try {
      await consumeToken(jwt)
    } catch (e) {
      if (e instanceof SyntaxError) {
        startLocalNotification()
      } else if (e.message === 'Token expired') {
        showError(ErrorCode.TokenExpired, e)
      } else if (e.message === 'Signature on token is invalid') {
        showError(ErrorCode.InvalidSignature, e)
      } else if (
        e.message === 'You are not the intended audience of received token'
      ) {
        showError(ErrorCode.WrongDID, e)
      } else if (e.message === 'The token nonce does not match the request') {
        showError(ErrorCode.WrongNonce, e)
      } else {
        showError(ErrorCode.Unknown, e)
      }
    }
  }

  return permission === RESULTS.AUTHORIZED ? (
    isCameraReady ? (
      <ScannerComponent
        reRenderKey={reRenderKey}
        onScan={onScan}
        isError={isError}
        colorAnimationValue={colorAnimationValue}
        textAnimationValue={textAnimationValue}
      />
    ) : null
  ) : (
    <NoPermissionComponent onPressEnable={onEnablePermission} />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  consumeToken: (jwt: string) => dispatch(consumeInteractionToken(jwt)),
  showError: (errorCode: ErrorCode, e: Error) =>
    dispatch(showErrorScreen(new AppError(errorCode, e))),
})

export const Scanner = connect(
  null,
  mapDispatchToProps,
)(ScannerContainer)
