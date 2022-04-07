import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenHeader from '~/components/ScreenHeader'
import BiometryAnimation from '~/components/BiometryAnimation'

import { useSuccess } from '~/hooks/loader'

import { useDeviceAuthState } from './module/deviceAuthContext'
import { useRedirectToLoggedIn } from '~/hooks/navigation'

import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useBiometry } from '~/hooks/biometry'
import BtnGroup from '~/components/BtnGroup'
import { View } from 'react-native'
import { useDisableLock } from '~/hooks/generic'
import useTranslation from '~/hooks/useTranslation'
import { useToasts } from '~/hooks/toasts'

const WalletBiometry: React.FC = () => {
  const { t } = useTranslation()
  const { biometryType } = useDeviceAuthState()
  const { authenticate, setBiometry } = useBiometry()
  const { scheduleErrorWarning } = useToasts()
  const disableLock = useDisableLock()
  const displaySuccessLoader = useSuccess()

  const handleRedirectToLogin = useRedirectToLoggedIn()

  const handleAuthenticate = async () => {
    try {
      const result = await disableLock(() => authenticate(biometryType))
      if (result.success) {
        setBiometry(biometryType)
        displaySuccessLoader(handleRedirectToLogin)
      }
    } catch (err) {
      scheduleErrorWarning(err)
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: BP({ default: 36, small: 28, xsmall: 24 }),
      }}
    >
      <ScreenHeader
        title={t('Biometry.header', { biometryType })}
        subtitle={t('Biometry.subheader')}
      />
      <BiometryAnimation
        biometryType={biometryType}
        handleAuthenticate={handleAuthenticate}
      />
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.activity}
        customStyles={{ paddingHorizontal: 25, opacity: 0.8 }}
      >
        {t('Biometry.activateBtn')}
      </JoloText>
      <View style={{ flex: 1 }} />
      <BtnGroup>
        <Btn type={BtnTypes.secondary} onPress={handleRedirectToLogin}>
          {t('Biometry.skipBtn')}
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

export default WalletBiometry
