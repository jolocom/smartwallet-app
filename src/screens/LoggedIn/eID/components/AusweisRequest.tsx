import React from 'react'
import { Linking, Platform, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import useTranslation from '~/hooks/useTranslation'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import { LogoContainerBAS } from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { eIDScreens } from '../types'
import eIDHooks from '../hooks'
import { AusweisBottomSheet, AusweisButtons, AusweisLogo } from '../styled'
import { AusweisStackParamList } from '..'

type AusweisRequestNavigation = StackNavigationProp<
  AusweisStackParamList,
  eIDScreens.InteractionSheet
>

export const AusweisRequest = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<AusweisRequestNavigation>()
  const { checkNfcSupport } = eIDHooks.useCheckNFC()
  const { providerUrl, providerName } = eIDHooks.useAusweisContext()
  const { cancelInteraction } = eIDHooks.useAusweisInteraction()
  const { shouldSkip: shouldSkipCompatibility } =
    eIDHooks.useAusweisSkipCompatibility()

  eIDHooks.useAusweisCancelBackHandler()

  const handleProceed = async () => {
    checkNfcSupport(() => {
      if (shouldSkipCompatibility || Platform.OS === 'ios') {
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
        /**
         * TODO:
         * create reuseable testIDs object
         */
        testID="ausweis-interaction-description"
      >
        {t('AusweisRequest.description', {
          serviceName: providerName,
          interpolation: {
            escapeValue: false,
          },
        })}
      </JoloText>
      <TouchableOpacity
        onPress={() => Linking.openURL(providerUrl)}
        testID="ausweis-requester-link"
      >
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.mini}
          color={Colors.success}
          customStyles={{
            marginTop: 16,
            marginBottom: 32,
          }}
        >
          {providerUrl}
        </JoloText>
      </TouchableOpacity>
      <AusweisButtons
        submitLabel={t('AusweisRequest.proceedBtn')}
        cancelLabel={t('Interaction.cancelBtn')}
        onSubmit={handleProceed}
        onCancel={handleIgnore}
      />
    </AusweisBottomSheet>
  )
}
