import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  useWindowDimensions,
  Dimensions,
  StyleSheet,
  StatusBar,
  TouchableHighlight,
  Animated,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { useSelector } from 'react-redux'

import { InteractionTransportType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { ErrorCode } from '@jolocom/sdk/js/src/lib/errors'

import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'

import { getLoaderState } from '~/modules/loader/selectors'
import { getInteractionType } from '~/modules/interaction/selectors'

import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

import useDelay from '~/hooks/useDelay'
import { useInteractionStart } from '~/hooks/sdk'

import { TorchOnIcon, TorchOffIcon } from '~/assets/svg'

import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const Camera = () => {
  const { height } = useWindowDimensions()
  const { startInteraction } = useInteractionStart(
    InteractionTransportType.HTTP,
  )

  const interactionType = useSelector(getInteractionType)
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)
  const shouldScan = !interactionType && !isLoaderVisible
  const overlayVisible = !interactionType

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
    useDelay(() => setRenderCamera(true), 300)
  }, [])

  const handleScan = async (e: { data: string }) => {
    try {
      await startInteraction(e.data)
    } catch (err) {
      console.log({ err })

      setError(true)
      if (err.code === ErrorCode.ParseJWTFailed) {
        setErrorText(strings.IS_THIS_THE_RIGHT_QR_CODE_TRY_AGAIN)
      } else {
        setErrorText(strings.LOOKS_LIKE_WE_CANT_PROVIDE_THIS_SERVICE)
      }
      Animated.parallel([animateColor(), animateText()]).start(() => {
        setError(false)
      })
    }
  }

  return (
    <ScreenContainer isFullscreen>
      {/* TODO: make sure with use insets and remove status bar it make content jump */}
      <StatusBar hidden />
      <View style={styles.scannerContainer}>
        <View style={styles.navigationContainer}>
          <NavigationHeader type={NavHeaderType.Close} />
        </View>
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
        {overlayVisible ? (
          <>
            <View style={styles.topOverlay} />
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
                  {
                    strings.ITS_ALL_AUTOMATIC_JUST_PLACE_YOUR_PHONE_ABOVE_THE_CODE
                  }
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
    top: 0,
    zIndex: 10,
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
      xsmall: 165,
      small: 165,
      medium: 175,
      large: 185,
    }),
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
      large: 60,
      medium: 40,
      small: 20,
      xsmall: 20,
    }),
  },
})

export default Camera
