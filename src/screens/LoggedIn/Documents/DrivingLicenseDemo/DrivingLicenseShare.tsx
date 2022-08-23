import React, { useEffect, useState } from 'react'
import { ActivityIndicator, LayoutAnimation, View } from 'react-native'
import QRCode from 'react-qr-code'
import JoloText from '~/components/JoloText'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import { useDrivingLicense } from './hooks'

export const DrivingLicenseShare = () => {
  const { startSharing } = useDrivingLicense()
  const [qrCodeString, setQrCodeString] = useState<string>()

  useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.spring,
      duration: 400,
    })

    startSharing().then(setQrCodeString).catch(console.warn)
  }, [])

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <NavigationHeader type={NavHeaderType.Close}>
        <JoloText color={Colors.white}>Digitalen Führerschein teilen</JoloText>
      </NavigationHeader>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            borderWidth: 20,
            borderColor: Colors.white,
            borderRadius: 14,
          }}
        >
          {qrCodeString ? (
            <QRCode value={qrCodeString} />
          ) : (
            <ActivityIndicator
              size={'large'}
              style={{ padding: 20, backgroundColor: Colors.white }}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  )
}
