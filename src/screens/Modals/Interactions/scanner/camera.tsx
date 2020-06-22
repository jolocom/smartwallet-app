import React, { useEffect, useState } from 'react'
import {
  View,
  useWindowDimensions,
  Dimensions,
  StyleSheet,
  StatusBar,
  TouchableHighlight,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'

import ScreenContainer from '~/components/ScreenContainer'
import Paragraph from '~/components/Paragraph'
import { Colors } from '~/utils/colors'
import NavigationHeader from '~/components/NavigationHeader'
import BP from '~/utils/breakpoints'
import useDelay from '~/hooks/useDelay'
import { TorchOnIcon, TorchOffIcon } from '~/assets/svg'

const Camera = () => {
  const { height } = useWindowDimensions()
  const [renderCamera, setRenderCamera] = useState(false)
  const [isTorchPressed, setTorchPressed] = useState(false)

  //FIXME: While the camera renders, the Modal transition freezes for a moment.
  //       Delaying as a temporary fix.
  useEffect(() => {
    useDelay(() => setRenderCamera(true), 200)
  }, [])

  return (
    <ScreenContainer isFullscreen>
      <StatusBar hidden />
      <View style={styles.scannerContainer}>
        <View style={styles.navigationContainer}>
          <NavigationHeader />
        </View>
        {renderCamera && (
          <QRCodeScanner
            containerStyle={{ position: 'absolute' }}
            onRead={(e) => console.log(e)}
            cameraStyle={{ height }}
            cameraProps={{
              captureAudio: false,
              flashMode: isTorchPressed
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off,
            }}
          />
        )}
        <View style={styles.topOverlay} />
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View style={styles.horizontalOverlay} />
          <View
            style={[
              styles.rectangle,
              { backgroundColor: 'transparent', borderColor: 'white' },
            ]}
          />
          <View style={styles.horizontalOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Paragraph customStyles={{ width: MARKER_SIZE }}>
            It’s all automatic, just place your phone above the code
          </Paragraph>
          <TouchableHighlight
            onPressIn={() => setTorchPressed(true)}
            onPressOut={() => setTorchPressed(false)}
            activeOpacity={1}
            underlayColor={'transparent'}
            style={styles.torch}
          >
            {isTorchPressed ? <TorchOnIcon /> : <TorchOffIcon />}
          </TouchableHighlight>
        </View>
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
    backgroundColor: 'transparent',
  },
  topOverlay: {
    backgroundColor: Colors.black65,
    width: '100%',
    height: BP({
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
    }),
  },
})

export default Camera
