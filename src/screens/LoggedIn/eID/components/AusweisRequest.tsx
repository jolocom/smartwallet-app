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

export const AusweisRequest = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { checkNfcSupport } = useCheckNFC()
  //TODO: not sure whether we need the provider or certificate issuer's URL/name
  const { providerUrl, providerName } = useAusweisContext()
  const { cancelInteraction } = useAusweisInteraction()
  const { shouldSkip: shouldSkipCompatibility } = useAusweisSkipCompatibility()

  const handleProceed = async () => {
    checkNfcSupport(() => {
      if (shouldSkipCompatibility) {
        // @ts-ignore
        redirect(eIDScreens.RequestDetails)
      } else {
        // @ts-ignore
        redirect(eIDScreens.ReadinessCheck)
      }
    })
  }

  const handleIgnore = cancelInteraction

  return (
    <AusweisBottomSheet onDismiss={handleIgnore}>
      <LogoContainerBAS>
        <AusweisLogo />
      </LogoContainerBAS>
      <InteractionTitle label={t('CredentialRequest.header')} />
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={Colors.white70}
        customStyles={{ paddingHorizontal: 10 }}
      >
        {`To complete your hotel check-in ${providerName} is requesting specific set of data.`}
      </JoloText>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={Colors.white70}
        customStyles={{
          textDecorationLine: 'underline',
          marginVertical: 40,
        }}
        onPress={() => Linking.openURL(providerUrl)}
      >
        {providerUrl}
      </JoloText>
      <AusweisButtons
        submitLabel="Review the request"
        cancelLabel="Ignore"
        onSubmit={handleProceed}
        onCancel={handleIgnore}
      />
    </AusweisBottomSheet>
  )
}
