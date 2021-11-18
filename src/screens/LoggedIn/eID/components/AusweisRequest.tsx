import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { Linking } from 'react-native'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import useTranslation from '~/hooks/useTranslation'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import { LogoContainerBAS } from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { eIDScreens } from '../types'
import {
  useCheckNFC,
  useAusweisContext,
  useAusweisInteraction,
  useAusweisSkipCompatibility,
} from '../hooks'
import { AusweisBottomSheet, AusweisButtons, AusweisLogo } from '../styled'
import useConnection from '~/hooks/connection'
import Btn, { BtnTypes } from '~/components/Btn'
import BP from '~/utils/breakpoints'
import Space from '~/components/Space'

export const AusweisRequest = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { checkNfcSupport } = useCheckNFC()
  //TODO: not sure whether we need the provider or certificate issuer's URL/name
  const { providerUrl, providerName } = useAusweisContext()
  const { cancelInteraction } = useAusweisInteraction()
  const { shouldSkip: shouldSkipCompatibility } = useAusweisSkipCompatibility()
  const { connected: isConnectedToTheInternet } = useConnection()

  const handleProceed = async () => {
    checkNfcSupport(() => {
      if (shouldSkipCompatibility) {
        navigation.navigate(eIDScreens.RequestDetails)
      } else {
        navigation.navigate(eIDScreens.ReadinessCheck)
      }
    })
  }

  const handleIgnore = cancelInteraction

  return (
    <AusweisBottomSheet onDismiss={handleIgnore}>
      <LogoContainerBAS>
        <AusweisLogo />
      </LogoContainerBAS>
      <InteractionTitle label={t('Ausweis.header')} />
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={Colors.white70}
        customStyles={{ paddingHorizontal: 10 }}
      >
        {t('AusweisRequest.description', {
          serviceName: providerName,
          interpolation: {
            escapeValue: false,
          },
        })}
      </JoloText>
      <Btn
        type={BtnTypes.quinary}
        size={BP({ default: 16, xsmall: 14 })}
        customTextStyles={{ opacity: 1 }}
        noBackground
        disabled={!isConnectedToTheInternet}
        onPress={() => Linking.openURL(providerUrl)}
      >
        {providerUrl}
      </Btn>
      <Space height={BP({ default: 20, xsmall: 14 })} />
      <AusweisButtons
        submitLabel={t('AusweisRequest.proceedBtn')}
        cancelLabel={t('Interaction.cancelBtn')}
        onSubmit={handleProceed}
        onCancel={handleIgnore}
      />
    </AusweisBottomSheet>
  )
}
