import { useIsFocused } from '@react-navigation/core'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Linking,
  Platform,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native'
import branch from 'react-native-branch'
import { RNCamera } from 'react-native-camera'
import Permissions from 'react-native-permissions'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { useDispatch, useSelector } from 'react-redux'

import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'

import { getLoaderState } from '~/modules/loader/selectors'

import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

import { useInteractionStart } from '~/hooks/interactions/handlers'

import { TorchOffIcon, TorchOnIcon } from '~/assets/svg'

import { useSafeArea } from 'react-native-safe-area-context'
import Dialog from '~/components/Dialog'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import useConnection from '~/hooks/connection'
import { useDisableLock } from '~/hooks/generic'
import { useRedirect } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import useErrors from '~/hooks/useErrors'
import useTranslation from '~/hooks/useTranslation'
import { getIsAppLocked } from '~/modules/account/selectors'
import {
  getAusweisScannerKey,
  getIsAusweisInteractionProcessed,
} from '~/modules/interaction/selectors'
import { dismissLoader } from '~/modules/loader/actions'
import { SCREEN_HEIGHT } from '~/utils/dimensions'
import { JoloTextSizes } from '~/utils/fonts'
import { useDrivingLicense } from '~/screens/LoggedIn/Documents/DrivingLicenseDemo/hooks'
import { ScreenNames } from '~/types/screens'

const majorVersionIOS = parseInt(Platform.Version as string, 10)
const SHOW_LOCAL_NETWORK_DIALOG = Platform.OS === 'ios' && majorVersionIOS >= 14

const Camera = () => {
  const { t } = useTranslation()
  const { errorScreen } = useErrors()
  const { startInteraction } = useInteractionStart()
  const dispatch = useDispatch()
  const disableLock = useDisableLock()
  const isScreenFocused = useIsFocused()
  const { connected: isConnectedToTheInternet } = useConnection()
  const { personalizeLicense } = useDrivingLicense()
  const redirect = useRedirect()

  const ausweisScannerKey = useSelector(getAusweisScannerKey)

  const isAppLocked = useSelector(getIsAppLocked)
  const isAuseisInteractionProcessed = useSelector(
    getIsAusweisInteractionProcessed,
  )
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)

  const isFocused = useIsFocused()

  const shouldScan =
    isFocused && !isLoaderVisible && !isAppLocked && !errorScreen

  const [renderCamera, setRenderCamera] = useState(false)
  const [isTorchPressed, setTorchPressed] = useState(false)

  const [isError, setError] = useState<boolean | undefined>(undefined)
  const [errorText, setErrorText] = useState('')
  const colorAnimationValue = useRef(new Animated.Value(0)).current
  const textAnimationValue = useRef(new Animated.Value(0)).current
  const { scheduleErrorWarning } = useToasts()

  useLayoutEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 300,
    })
  }, [isScreenFocused])

  const animateColor = () =>
    Animated.sequence([
      Animated.timing(colorAnimationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnimationValue, {
        toValue: 0,
        delay: 400,
        duration: 300,
        useNativeDriver: false,
      }),
    ])

  const animateText = () =>
    Animated.sequence([
      Animated.timing(textAnimationValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(textAnimationValue, {
        toValue: 0,
        delay: 1200,
        duration: 500,
        useNativeDriver: true,
      }),
    ])

  const markerBackground = colorAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.transparent, Colors.error40],
  })

  useEffect(() => {
    //TODO: While the camera renders, the Modal transition freezes for a moment.
    //      Delaying as a temporary fix.
    setTimeout(() => {
      setRenderCamera(true)
    }, 300)
  }, [])

  useEffect(() => {
    if (isAuseisInteractionProcessed) {
      dispatch(dismissLoader())
    }
  }, [isAuseisInteractionProcessed])

  const openURL = async (url: string) => {
    let canOpen: boolean | undefined
    try {
      canOpen = await Linking.canOpenURL(url)
    } catch (e) {
      canOpen = false
    }
    return canOpen
  }

  const handleScan = async (e: { data: string }) => {
    if (!isConnectedToTheInternet) {
      setError(true)
      /** * TODO:
       * add copy/translation
       */
      setErrorText('Internet connection is required to proceed')
      return
    }
    try {
      const canOpen = await openURL(e.data)
      // FIXME: Ideally we should use the value from the .env config, but there
      // seems to be an issue with reading it.

      if (e.data.startsWith('iso23220-3-sed:')) {
        personalizeLicense(e.data, (requests) => {
          redirect(ScreenNames.DrivingLicenseForm, { requests })
        })
      } else if (canOpen && e.data.includes('jolocom.app.link')) {
        disableLock(() => {
          // NOTE: Since `branch.openURL` is not a promise, we need to assure the lock is disabled
          // when the app goes into background when the deeplink is opened
          return new Promise<void>((res) => {
            branch.openURL(e.data)
            setTimeout(() => {
              res()
            }, 1000)
          })
        }).catch(scheduleErrorWarning)
      } else {
        await startInteraction(e.data)
      }
    } catch (err) {
      console.log('handleScan error', { err })

      setError(true)
      setErrorText(t('Camera.errorMsg'))
    }
  }

  useEffect(() => {
    if (isError === true) {
      Animated.parallel([animateColor(), animateText()]).start(() => {
        setError(false)
      })
    }
  }, [isError])

  const { top } = useSafeArea()

  const handleLocalPermissionPress = () => {
    Permissions.openSettings().catch(scheduleErrorWarning)
  }

  /**
   * NOTE:
   * when the camera is on NFC scanner doesn't work;
   */
  if (ausweisScannerKey) return null

  return (
    <ScreenContainer isFullscreen backgroundColor={Colors.black}>
      <View style={styles.scannerContainer}>
        {isScreenFocused && (
          <View style={[styles.navigationContainer, { top }]}>
            <NavigationHeader type={NavHeaderType.Close} />
          </View>
        )}
        {renderCamera && (
          <QRCodeScanner
            containerStyle={{ position: 'absolute' }}
            // eslint-disable-next-line
            onRead={shouldScan ? handleScan : () => {}}
            vibrate={shouldScan}
            reactivate={true}
            reactivateTimeout={3000}
            fadeIn
            cameraStyle={{ height: SCREEN_HEIGHT }}
            cameraProps={{
              captureAudio: false,
              flashMode: isTorchPressed
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off,
            }}
          />
        )}
        {isScreenFocused ? (
          <>
            <View style={styles.topOverlay}>
              {SHOW_LOCAL_NETWORK_DIALOG && (
                <Dialog onPress={handleLocalPermissionPress}>
                  <JoloText
                    customStyles={{ textAlign: 'left' }}
                    size={JoloTextSizes.mini}
                    color={Colors.white}
                  >
                    {t('Camera.localNetworkMessage')}
                    {'     '}
                    <JoloText size={JoloTextSizes.mini} color={Colors.blue}>
                      {BP({
                        default: t('Camera.localNetworkBtn_short'),
                        large: t('Camera.localNetworkBtn_long'),
                      })}
                    </JoloText>
                  </JoloText>
                </Dialog>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <View style={styles.horizontalOverlay} />
              <Animated.View
                style={[
                  styles.rectangle,
                  {
                    backgroundColor: markerBackground,
                    borderColor: isError ? Colors.error : Colors.white,
                  },
                ]}
              />
              <View style={styles.horizontalOverlay} />
            </View>
            <View style={styles.bottomOverlay}>
              {isError ? (
                <JoloText
                  animated
                  kind={JoloTextKind.subtitle}
                  size={JoloTextSizes.middle}
                  customStyles={{
                    width: MARKER_SIZE,
                    color: Colors.error,
                    opacity: textAnimationValue,
                  }}
                >
                  {errorText}
                </JoloText>
              ) : (
                <JoloText
                  kind={JoloTextKind.subtitle}
                  size={JoloTextSizes.middle}
                  customStyles={{ width: MARKER_SIZE }}
                >
                  {t('Camera.details')}
                </JoloText>
              )}
              <TouchableHighlight
                onPressIn={() => setTorchPressed(true)}
                onPressOut={() => setTorchPressed(false)}
                activeOpacity={1}
                underlayColor={Colors.transparent}
                style={styles.torch}
              >
                {isTorchPressed ? <TorchOnIcon /> : <TorchOffIcon />}
              </TouchableHighlight>
            </View>
          </>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>
    </ScreenContainer>
  )
}

const SCREEN_WIDTH = Dimensions.get('window').width
const MARKER_SIZE = SCREEN_WIDTH * 0.75

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
  },
  scannerContainer: {
    width: '100%',
    flex: 1,
  },
  rectangle: {
    height: MARKER_SIZE,
    width: MARKER_SIZE,
    borderRadius: 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.transparent,
  },
  topOverlay: {
    backgroundColor: Colors.black65,
    width: '100%',
    height: BP({
      default: 165,
      medium: 215,
      large: 225,
    }),
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: BP({ xsmall: 20, default: 28 }),
    paddingHorizontal: BP({ default: 12, large: 24 }),
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: Colors.black65,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
    justifyContent: 'space-between',
    paddingTop: 18,
  },
  horizontalOverlay: {
    height: MARKER_SIZE,
    width: (SCREEN_WIDTH - MARKER_SIZE) / 2,
    backgroundColor: Colors.black65,
  },
  torch: {
    width: 69,
    height: 69,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BP({
      default: 20,
      medium: 40,
      large: 60,
    }),
  },
})

export default Camera
