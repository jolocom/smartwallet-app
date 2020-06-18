import React from 'react'
import { View, useWindowDimensions, Dimensions, StyleSheet } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'

import ScreenContainer from '~/components/ScreenContainer'
import Paragraph from '~/components/Paragraph'
import { Colors } from '~/utils/colors'
import NavigationHeader from '~/components/NavigationHeader'
import BP from '~/utils/breakpoints'

const Camera = () => {
  const { height } = useWindowDimensions()

  return (
    <ScreenContainer isFullscreen>
      <View style={styles.scannerContainer}>
        <View style={{ position: 'absolute', top: 0, zIndex: 10 }}>
          <NavigationHeader />
        </View>
        <QRCodeScanner
          containerStyle={{ position: 'absolute' }}
          onRead={(e) => console.log(e)}
          cameraStyle={{ height }}
        />
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
        </View>
      </View>
    </ScreenContainer>
  )
}

const SCREEN_WIDTH = Dimensions.get('window').width
const MARKER_SIZE = SCREEN_WIDTH * 0.75

const styles = StyleSheet.create({
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
})

export default Camera
