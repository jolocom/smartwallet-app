import React from 'react'
import { View, useWindowDimensions, StyleSheet } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import useCameraPermissions, { Results } from './useCameraPermissions'
import Paragraph from '~/components/Paragraph'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'

const Scanner: React.FC = () => {
  const { height } = useWindowDimensions()
  const { permission, handlePlatformPermissions } = useCameraPermissions()

  return (
    <ScreenContainer isFullscreen>
      {permission === Results.GRANTED ? (
        <View style={styles.scannerContainer}>
          <QRCodeScanner
            containerStyle={{ position: 'absolute' }}
            onRead={(e) => console.log(e)}
            cameraStyle={{ height }}
          />
        </View>
      ) : (
        <View style={styles.permissionContainer}>
          <Header customStyles={styles.permissionText}>
            {strings.CAMERA_PERMISSION}
          </Header>
          <Paragraph
            customStyles={{
              ...styles.permissionParagraph,
              ...styles.permissionText,
            }}
          >
            {strings.YOU_CANT_SCAN_WITHOUT_MAIN_FUNCTION}
          </Paragraph>
          <Btn
            type={BtnTypes.secondary}
            customTextStyles={{ color: Colors.activity }}
            onPress={handlePlatformPermissions}
          >
            {strings.TAP_TO_ACTIVATE_CAMERA}
          </Btn>
        </View>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  scannerContainer: {
    width: '100%',
    flex: 1,
  },
  permissionContainer: {
    paddingHorizontal: '5%',
    width: '100%',
  },
  permissionParagraph: {
    paddingVertical: 18,
  },
  permissionText: {
    color: Colors.white85,
  },
})

export default Scanner
