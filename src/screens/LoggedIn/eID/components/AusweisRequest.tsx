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
import {
  useCheckNFC,
  useAusweisContext,
  useAusweisInteraction,
  useAusweisSkipCompatibility,
  useAusweisCancelBackHandler,
} from '../hooks'
import { AusweisBottomSheet, AusweisButtons, AusweisLogo } from '../styled'
import { AusweisStackParamList } from '..'

type AusweisRequestNavigation = StackNavigationProp<
  AusweisStackParamList,
  eIDScreens.InteractionSheet
>

export const AusweisRequest = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<AusweisRequestNavigation>()
  const { checkNfcSupport } = useCheckNFC()
  const { providerUrl, providerName } = useAusweisContext()
  const { cancelInteraction } = useAusweisInteraction()
  const { shouldSkip: shouldSkipCompatibility } = useAusweisSkipCompatibility()

  useAusweisCancelBackHandler()

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
