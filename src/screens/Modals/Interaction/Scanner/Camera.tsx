import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  useWindowDimensions,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Animated,
  Platform,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import Permissions from 'react-native-permissions'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'

import { getLoaderState } from '~/modules/loader/selectors'
import { getInteractionType } from '~/modules/interaction/selectors'

import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

import { useInteractionStart } from '~/hooks/interactions/handlers'

import { TorchOnIcon, TorchOffIcon } from '~/assets/svg'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { useSafeArea } from 'react-native-safe-area-context'
import Dialog from '~/components/Dialog'
import { useIsFocused } from '@react-navigation/core'
import { getIsAppLocked } from '~/modules/account/selectors'
import useErrors from '~/hooks/useErrors'
import useTranslation from '~/hooks/useTranslation'

const majorVersionIOS = parseInt(Platform.Version as string, 10)
const SHOW_LOCAL_NETWORK_DIALOG = Platform.OS === 'ios' && majorVersionIOS >= 14

const Camera = () => {
  const { t } = useTranslation()
  const { height } = useWindowDimensions()
  const { errorScreen } = useErrors()
  const startInteraction = useInteractionStart()
  const isScreenFocused = useIsFocused()

  const isAppLocked = useSelector(getIsAppLocked)
  const interactionType = useSelector(getInteractionType)
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)

  const shouldScan =
    !interactionType && !isLoaderVisible && !isAppLocked && !errorScreen

  const [renderCamera, setRenderCamera] = useState(false)
  const [isTorchPressed, setTorchPressed] = useState(false)

  const [isError, setError] = useState(false)
  const [errorText, setErrorText] = useState('')
  const colorAnimationValue = useRef(new Animated.Value(0)).current
  const textAnimationValue = useRef(new Animated.Value(0)).current

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

  const handleScan = async (e: { data: string }) => {
    try {
      await startInteraction(e.data)
    } catch (err) {
      console.log({ err })

      setError(true)
      setErrorText(t('Camera.errorMsg'))
      Animated.parallel([animateColor(), animateText()]).start(() => {
        setError(false)
      })
    }
  }

  const { top } = useSafeArea()

  const handleLocalPermissionPress = () => {
    Permissions.openSettings()
  }

  return (
    <ScreenContainer hideStatusBar isFullscreen backgroundColor={Colors.black}>
      <View style={styles.scannerContainer}>
        {isScreenFocused && (
          <View style={[styles.navigationContainer, { top }]}>
            <NavigationHeader type={NavHeaderType.Close} />
          </View>
        )}
        {renderCamera && (
          <QRCodeScanner
            containerStyle={{ position: 'absolute' }}
            onRead={shouldScan ? handleScan : () => {}}
            vibrate={shouldScan}
            reactivate={true}
            reactivateTimeout={3000}
            fadeIn
            cameraStyle={{ height }}
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
          <View style={{ flex: 1, backgroundColor: Colors.black65 }} />
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
  torchWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
