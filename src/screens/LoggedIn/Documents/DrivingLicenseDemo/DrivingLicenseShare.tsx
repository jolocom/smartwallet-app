import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutAnimation, View } from 'react-native'
import QRCode from 'react-qr-code'
import JoloText from '~/components/JoloText'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import { useDrivingLicense } from './hooks'

const PLACEHOLDER_QR = 'TEST_QR_CODE'

export const DrivingLicenseShare = () => {
  const { t } = useTranslation()
  const { prepareDeviceEngagement, prepareEngagementEvents } =
    useDrivingLicense()
  const [qrCodeString, setQrCodeString] = useState<string>(PLACEHOLDER_QR)

  useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.spring,
      duration: 400,
    })

    prepareEngagementEvents()
    prepareDeviceEngagement()
      .then((qr) => {
        setQrCodeString(qr)
      })
      .catch(console.warn)
  }, [])

  return (
    <ScreenContainer
      backgroundColor={Colors.black}
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <NavigationHeader type={NavHeaderType.Close} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <JoloText color={Colors.white}>
          {qrCodeString === PLACEHOLDER_QR
            ? t('Loader.loading') + '...'
            : t('mdl.shareMenu')}
        </JoloText>
        <View
          style={{
            borderWidth: 20,
            borderColor: Colors.white,
            borderRadius: 14,
            marginTop: 42,
            opacity: qrCodeString === PLACEHOLDER_QR ? 0.1 : 1,
          }}
        >
          <QRCode value={qrCodeString} />
        </View>
      </View>
    </ScreenContainer>
  )
}
